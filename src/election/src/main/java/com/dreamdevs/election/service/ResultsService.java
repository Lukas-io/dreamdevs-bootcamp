package com.dreamdevs.election.service;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Award;
import com.dreamdevs.election.model.AwardStatus;
import com.dreamdevs.election.model.Vote;
import com.dreamdevs.election.repository.VoteRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResultsService {

    private final VoteRepository voteRepository;
    private final AwardService awardService;

    public ResultsService(VoteRepository voteRepository, AwardService awardService) {
        this.voteRepository = voteRepository;
        this.awardService = awardService;
    }

    public Map<String, Object> getResults(String awardId) {
        Award award = awardService.getAward(awardId);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("awardId", award.getId());
        response.put("title", award.getTitle());
        response.put("revealed", award.isRevealed());

        if (!award.isRevealed()) {
            response.put("votes", null);
            return response;
        }

        List<Vote> votes = voteRepository.findByAwardId(awardId);
        List<Map<String, Object>> voteDetails = new ArrayList<>();
        for (Vote vote : votes) {
            Map<String, Object> entry = new LinkedHashMap<>();
            if (!award.isAnonymous()) {
                entry.put("voterId", vote.getVoterId());
            } else {
                entry.put("voterId", null);
            }
            entry.put("nomineeName", vote.getNomineeName());
            voteDetails.add(entry);
        }
        response.put("votes", voteDetails);
        return response;
    }

    public Map<String, Object> declareWinner(String awardId) {
        Award award = awardService.getAward(awardId);

        if (!award.isRevealed()) {
            throw new ElectionException("Results for '" + award.getTitle() + "' have not been revealed yet.");
        }

        Map<String, Long> tally = tallyVotes(awardId);

        if (tally.isEmpty()) {
            throw new ElectionException("No votes have been cast for '" + award.getTitle() + "'.");
        }

        long maxVotes = Collections.max(tally.values());
        List<String> topNominees = tally.entrySet().stream()
                .filter(e -> e.getValue() == maxVotes)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("awardTitle", award.getTitle());

        if (topNominees.size() > 1) {
            result.put("tie", true);
            result.put("tiedNominees", topNominees);
            result.put("votes", maxVotes);
        } else {
            result.put("tie", false);
            result.put("winner", topNominees.get(0));
            result.put("votes", maxVotes);
        }
        return result;
    }

    public Map<String, Double> getStats(String awardId) {
        Award award = awardService.getAward(awardId);

        if (!award.isRevealed()) {
            throw new ElectionException("Stats for '" + award.getTitle() + "' are not available until results are revealed.");
        }

        Map<String, Long> tally = tallyVotes(awardId);
        long total = tally.values().stream().mapToLong(Long::longValue).sum();

        Map<String, Double> stats = new LinkedHashMap<>();
        for (Map.Entry<String, Long> entry : tally.entrySet()) {
            double percentage = Math.round((entry.getValue() * 100.0 / total) * 100.0) / 100.0;
            stats.put(entry.getKey(), percentage);
        }
        return stats;
    }

    public String getClassMvp() {
        List<Vote> allVotes = voteRepository.findAll();

        if (allVotes.isEmpty()) {
            throw new ElectionException("No votes have been cast yet.");
        }

        Map<String, Long> totalVotesPerNominee = allVotes.stream()
                .collect(Collectors.groupingBy(Vote::getNomineeName, Collectors.counting()));

        return totalVotesPerNominee.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElseThrow(() -> new ElectionException("Could not determine Class MVP."));
    }

    public Map<String, List<String>> getSweep() {
        List<Award> awards = awardService.listAwards().stream()
                .filter(a -> a.getStatus() == AwardStatus.CLOSED && a.isRevealed())
                .collect(Collectors.toList());

        Map<String, List<String>> nomineeToAwardTitles = new HashMap<>();

        for (Award award : awards) {
            Map<String, Long> tally = tallyVotes(award.getId());
            if (tally.isEmpty()) continue;

            long maxVotes = Collections.max(tally.values());
            List<String> winners = tally.entrySet().stream()
                    .filter(e -> e.getValue() == maxVotes)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            // In a tie, no single winner — skip for sweep purposes
            if (winners.size() == 1) {
                String winner = winners.get(0);
                nomineeToAwardTitles.computeIfAbsent(winner, k -> new ArrayList<>()).add(award.getTitle());
            }
        }

        // Return only those who won more than one award
        return nomineeToAwardTitles.entrySet().stream()
                .filter(e -> e.getValue().size() > 1)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public String getMostNominated() {
        List<Award> awards = awardService.listAwards();

        Map<String, Long> nominationCount = new HashMap<>();
        for (Award award : awards) {
            for (String nominee : award.getNominees()) {
                nominationCount.merge(nominee, 1L, Long::sum);
            }
        }

        return nominationCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElseThrow(() -> new ElectionException("No nominations found."));
    }

    public Map<String, List<String>> getUnderdogs() {
        List<Award> awards = awardService.listAwards().stream()
                .filter(a -> a.getStatus() == AwardStatus.CLOSED && a.isRevealed())
                .collect(Collectors.toList());

        Map<String, List<String>> underdogs = new LinkedHashMap<>();

        for (Award award : awards) {
            Map<String, Long> tally = tallyVotes(award.getId());
            List<String> underdogNominees = tally.entrySet().stream()
                    .filter(e -> e.getValue() == 1)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
            underdogs.put(award.getId(), underdogNominees);
        }
        return underdogs;
    }

    public String getSummary() {
        List<Award> closedAndRevealed = awardService.listAwards().stream()
                .filter(a -> a.getStatus() == AwardStatus.CLOSED && a.isRevealed())
                .collect(Collectors.toList());

        if (closedAndRevealed.isEmpty()) {
            return "No results available yet.";
        }

        StringBuilder sb = new StringBuilder();
        sb.append("=== GRADUATING CLASS AWARDS — RESULTS ===\n\n");

        for (Award award : closedAndRevealed) {
            sb.append("🏆 ").append(award.getTitle()).append("\n");
            Map<String, Long> tally = tallyVotes(award.getId());

            if (tally.isEmpty()) {
                sb.append("   No votes cast.\n");
            } else {
                tally.entrySet().stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                        .forEach(e -> sb.append("   ").append(e.getKey()).append(": ").append(e.getValue()).append(" vote(s)\n"));
            }
            sb.append("\n");
        }
        return sb.toString();
    }

    private Map<String, Long> tallyVotes(String awardId) {
        return voteRepository.findByAwardId(awardId).stream()
                .collect(Collectors.groupingBy(Vote::getNomineeName, Collectors.counting()));
    }
}
