package com.dreamdevs.election.service;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Award;
import com.dreamdevs.election.model.Voter;
import com.dreamdevs.election.repository.AwardRepository;
import com.dreamdevs.election.repository.VoteRepository;
import com.dreamdevs.election.repository.VoterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ResultsServiceTest {

    private ResultsService resultsService;
    private VotingService votingService;
    private AwardService awardService;
    private VoterService voterService;

    private Voter tunde;
    private Voter amaka;
    private Voter seun;
    private Voter ngozi;

    @BeforeEach
    void setUp() {
        AwardRepository awardRepository = new AwardRepository();
        VoterRepository voterRepository = new VoterRepository();
        VoteRepository voteRepository = new VoteRepository();

        awardService = new AwardService(awardRepository);
        voterService = new VoterService(voterRepository);
        votingService = new VotingService(voteRepository, awardService, voterService);
        resultsService = new ResultsService(voteRepository, awardService);

        tunde = voterService.registerVoter("Tunde Bakare", "STU001");
        amaka = voterService.registerVoter("Amaka Obi", "STU002");
        seun = voterService.registerVoter("Seun Kuti", "STU003");
        ngozi = voterService.registerVoter("Ngozi Eze", "STU004");
    }

    // --- Results visibility ---

    @Test
    void getResults_forUnrevealedAward_returnsHiddenResults() {
        Award award = awardService.createAward("Class Clown", List.of("Tunde Bakare", "Amaka Obi"), false);
        awardService.openAward(award.getId());
        votingService.castVote(tunde.getId(), award.getId(), "Tunde Bakare");
        awardService.closeAward(award.getId());

        Map<String, Object> results = resultsService.getResults(award.getId());

        assertEquals(false, results.get("revealed"));
        assertNull(results.get("votes"));
    }

    @Test
    void getResults_afterReveal_returnsFullBreakdown() {
        Award award = awardService.createAward("Class Clown", List.of("Tunde Bakare", "Amaka Obi"), false);
        awardService.openAward(award.getId());
        votingService.castVote(tunde.getId(), award.getId(), "Tunde Bakare");
        awardService.closeAward(award.getId());
        awardService.revealAward(award.getId());

        Map<String, Object> results = resultsService.getResults(award.getId());

        assertEquals(true, results.get("revealed"));
        assertNotNull(results.get("votes"));
    }

    @Test
    void getResults_anonymousAward_hidesVoterIdentity() {
        Award award = awardService.createAward("Most Likely to Get Married", List.of("Bisi", "Emeka"), true);
        awardService.openAward(award.getId());
        votingService.castVote(tunde.getId(), award.getId(), "Bisi");
        awardService.closeAward(award.getId());
        awardService.revealAward(award.getId());

        Map<String, Object> results = resultsService.getResults(award.getId());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> votes = (List<Map<String, Object>>) results.get("votes");
        votes.forEach(v -> assertNull(v.get("voterId")));
    }

    // --- Winner declaration ---

    @Test
    void declareWinner_withClearLeader_returnsWinner() {
        Award award = awardService.createAward("Most Successful", List.of("Chidi", "Ngozi", "Emeka"), false);
        awardService.openAward(award.getId());
        votingService.castVote(tunde.getId(), award.getId(), "Chidi");
        votingService.castVote(amaka.getId(), award.getId(), "Chidi");
        votingService.castVote(seun.getId(), award.getId(), "Ngozi");
        awardService.closeAward(award.getId());
        awardService.revealAward(award.getId());

        Map<String, Object> result = resultsService.declareWinner(award.getId());

        assertFalse((Boolean) result.get("tie"));
        assertEquals("Chidi", result.get("winner"));
    }

    @Test
    void declareWinner_onTie_returnsTieWithTiedNames() {
        Award award = awardService.createAward("Most Likely to Travel", List.of("Bisi", "Kemi"), false);
        awardService.openAward(award.getId());
        votingService.castVote(tunde.getId(), award.getId(), "Bisi");
        votingService.castVote(amaka.getId(), award.getId(), "Kemi");
        awardService.closeAward(award.getId());
        awardService.revealAward(award.getId());

        Map<String, Object> result = resultsService.declareWinner(award.getId());

        assertTrue((Boolean) result.get("tie"));
        @SuppressWarnings("unchecked")
        List<String> tied = (List<String>) result.get("tiedNominees");
        assertTrue(tied.containsAll(List.of("Bisi", "Kemi")));
    }

    @Test
    void declareWinner_whenNoVotesCast_throwsElectionException() {
        Award award = awardService.createAward("Best Dressed", List.of("Kemi", "Femi"), false);
        awardService.openAward(award.getId());
        awardService.closeAward(award.getId());
        awardService.revealAward(award.getId());

        assertThrows(ElectionException.class, () -> resultsService.declareWinner(award.getId()));
    }

    @Test
    void declareWinner_onUnrevealedAward_throwsElectionException() {
        Award award = awardService.createAward("Best Dressed", List.of("Kemi", "Femi"), false);
        awardService.openAward(award.getId());
        votingService.castVote(tunde.getId(), award.getId(), "Kemi");
        awardService.closeAward(award.getId());

        assertThrows(ElectionException.class, () -> resultsService.declareWinner(award.getId()));
    }

    // --- Stats ---

    @Test
    void getStats_returnsPercentageBreakdown() {
        Award award = awardService.createAward("Class Clown", List.of("Tunde Bakare", "Amaka Obi"), false);
        awardService.openAward(award.getId());
        votingService.castVote(tunde.getId(), award.getId(), "Tunde Bakare");
        votingService.castVote(amaka.getId(), award.getId(), "Tunde Bakare");
        votingService.castVote(seun.getId(), award.getId(), "Amaka Obi");
        awardService.closeAward(award.getId());
        awardService.revealAward(award.getId());

        Map<String, Double> stats = resultsService.getStats(award.getId());

        assertEquals(100.0, stats.values().stream().mapToDouble(Double::doubleValue).sum(), 0.01);
        assertEquals(66.67, stats.get("Tunde Bakare"), 0.01);
        assertEquals(33.33, stats.get("Amaka Obi"), 0.01);
    }

    @Test
    void getStats_onUnrevealedAward_throwsElectionException() {
        Award award = awardService.createAward("Class Clown", List.of("Tunde Bakare", "Amaka Obi"), false);
        awardService.openAward(award.getId());
        awardService.closeAward(award.getId());

        assertThrows(ElectionException.class, () -> resultsService.getStats(award.getId()));
    }

    // --- Class MVP ---

    @Test
    void getClassMvp_returnsPersonWithMostTotalVotes() {
        Award award1 = awardService.createAward("Class Clown", List.of("Tunde Bakare", "Amaka Obi"), false);
        Award award2 = awardService.createAward("Most Successful", List.of("Tunde Bakare", "Chidi Nwosu"), false);

        awardService.openAward(award1.getId());
        votingService.castVote(tunde.getId(), award1.getId(), "Tunde Bakare");
        votingService.castVote(amaka.getId(), award1.getId(), "Tunde Bakare");
        awardService.closeAward(award1.getId());
        awardService.revealAward(award1.getId());

        awardService.openAward(award2.getId());
        votingService.castVote(seun.getId(), award2.getId(), "Tunde Bakare");
        votingService.castVote(ngozi.getId(), award2.getId(), "Chidi Nwosu");
        awardService.closeAward(award2.getId());
        awardService.revealAward(award2.getId());

        String mvp = resultsService.getClassMvp();

        assertEquals("Tunde Bakare", mvp);
    }

    @Test
    void getClassMvp_whenNoVotesExist_throwsElectionException() {
        assertThrows(ElectionException.class, () -> resultsService.getClassMvp());
    }

    // --- Sweep detection ---

    @Test
    void getSweep_returnsNomineeWinningMultipleAwards() {
        Award award1 = awardService.createAward("Class Clown", List.of("Tunde Bakare", "Amaka Obi"), false);
        Award award2 = awardService.createAward("Most Likely to Be Famous", List.of("Tunde Bakare", "Ngozi Eze"), false);

        awardService.openAward(award1.getId());
        votingService.castVote(tunde.getId(), award1.getId(), "Tunde Bakare");
        votingService.castVote(amaka.getId(), award1.getId(), "Tunde Bakare");
        awardService.closeAward(award1.getId());
        awardService.revealAward(award1.getId());

        awardService.openAward(award2.getId());
        votingService.castVote(seun.getId(), award2.getId(), "Tunde Bakare");
        votingService.castVote(ngozi.getId(), award2.getId(), "Tunde Bakare");
        awardService.closeAward(award2.getId());
        awardService.revealAward(award2.getId());

        Map<String, List<String>> sweep = resultsService.getSweep();

        assertTrue(sweep.containsKey("Tunde Bakare"));
        assertEquals(2, sweep.get("Tunde Bakare").size());
    }

    @Test
    void getSweep_whenNobodyWinsMultiple_returnsEmptyMap() {
        Award award1 = awardService.createAward("Class Clown", List.of("Tunde Bakare", "Amaka Obi"), false);
        Award award2 = awardService.createAward("Most Successful", List.of("Chidi Nwosu", "Ngozi Eze"), false);

        awardService.openAward(award1.getId());
        votingService.castVote(tunde.getId(), award1.getId(), "Tunde Bakare");
        awardService.closeAward(award1.getId());
        awardService.revealAward(award1.getId());

        awardService.openAward(award2.getId());
        votingService.castVote(amaka.getId(), award2.getId(), "Chidi Nwosu");
        awardService.closeAward(award2.getId());
        awardService.revealAward(award2.getId());

        Map<String, List<String>> sweep = resultsService.getSweep();

        assertTrue(sweep.isEmpty());
    }

    // --- Most nominated ---

    @Test
    void getMostNominated_returnsPersonNominatedInMostAwards() {
        awardService.createAward("Class Clown", List.of("Tunde Bakare", "Amaka Obi"), false);
        awardService.createAward("Most Successful", List.of("Tunde Bakare", "Chidi Nwosu"), false);
        awardService.createAward("Best Dressed", List.of("Tunde Bakare", "Ngozi Eze"), false);
        awardService.createAward("Most Likely to Travel", List.of("Amaka Obi", "Ngozi Eze"), false);

        String mostNominated = resultsService.getMostNominated();

        assertEquals("Tunde Bakare", mostNominated);
    }

    // --- Underdog ---

    @Test
    void getUnderdogs_returnsNomineesWithExactlyOneVote() {
        Award award = awardService.createAward("Class Clown", List.of("Tunde Bakare", "Amaka Obi", "Seun Kuti"), false);
        awardService.openAward(award.getId());
        votingService.castVote(tunde.getId(), award.getId(), "Tunde Bakare");
        votingService.castVote(amaka.getId(), award.getId(), "Tunde Bakare");
        votingService.castVote(seun.getId(), award.getId(), "Amaka Obi");
        // Seun Kuti gets 0 votes, Amaka gets 1 (underdog), Tunde gets 2
        awardService.closeAward(award.getId());
        awardService.revealAward(award.getId());

        Map<String, List<String>> underdogs = resultsService.getUnderdogs();

        assertTrue(underdogs.get(award.getTitle()).contains("Amaka Obi"));
        assertFalse(underdogs.get(award.getTitle()).contains("Tunde Bakare"));
        assertFalse(underdogs.get(award.getTitle()).contains("Seun Kuti"));
    }

    @Test
    void getUnderdogs_whenNoOneHasExactlyOneVote_returnsEmptyForThatAward() {
        Award award = awardService.createAward("Best Dressed", List.of("Kemi", "Femi"), false);
        awardService.openAward(award.getId());
        votingService.castVote(tunde.getId(), award.getId(), "Kemi");
        votingService.castVote(amaka.getId(), award.getId(), "Kemi");
        awardService.closeAward(award.getId());
        awardService.revealAward(award.getId());

        Map<String, List<String>> underdogs = resultsService.getUnderdogs();

        assertTrue(underdogs.getOrDefault(award.getTitle(), List.of()).isEmpty());
    }

    // --- Stats with no votes ---

    @Test
    void getStats_whenNoVotesCast_throwsElectionException() {
        Award award = awardService.createAward("Empty Award", List.of("Kemi", "Femi"), false);
        awardService.openAward(award.getId());
        awardService.closeAward(award.getId());
        awardService.revealAward(award.getId());

        assertThrows(ElectionException.class, () -> resultsService.getStats(award.getId()));
    }
}
