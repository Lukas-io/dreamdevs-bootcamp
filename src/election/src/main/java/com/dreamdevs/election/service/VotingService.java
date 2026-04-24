package com.dreamdevs.election.service;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Award;
import com.dreamdevs.election.model.AwardStatus;
import com.dreamdevs.election.model.Vote;
import com.dreamdevs.election.model.Voter;
import com.dreamdevs.election.repository.VoteRepository;
import org.springframework.stereotype.Service;

@Service
public class VotingService {

    private final VoteRepository voteRepository;
    private final AwardService awardService;
    private final VoterService voterService;

    public VotingService(VoteRepository voteRepository, AwardService awardService, VoterService voterService) {
        this.voteRepository = voteRepository;
        this.awardService = awardService;
        this.voterService = voterService;
    }

    public Vote castVote(String voterId, String awardId, String nomineeName) {
        Voter voter = voterService.getVoter(voterId);
        Award award = awardService.getAward(awardId);

        if (!voter.isActive()) {
            throw new ElectionException("Voter '" + voter.getName() + "' is deactivated and cannot vote.");
        }
        if (award.getStatus() == AwardStatus.PENDING) {
            throw new ElectionException("Voting has not started yet for '" + award.getTitle() + "'.");
        }
        if (award.getStatus() == AwardStatus.CLOSED) {
            throw new ElectionException("Voting has already closed for '" + award.getTitle() + "'.");
        }
        boolean validNominee = award.getNominees().stream()
                .anyMatch(n -> n.getName().equals(nomineeName));
        if (!validNominee) {
            throw new ElectionException("'" + nomineeName + "' is not a nominee for '" + award.getTitle() + "'.");
        }
        if (voteRepository.existsByVoterIdAndAwardId(voterId, awardId)) {
            throw new ElectionException("You have already voted for '" + award.getTitle() + "'.");
        }

        return voteRepository.save(new Vote(voterId, awardId, nomineeName));
    }
}
