package com.dreamdevs.election.service;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Award;
import com.dreamdevs.election.model.Nominee;
import com.dreamdevs.election.model.Vote;
import com.dreamdevs.election.model.Voter;
import com.dreamdevs.election.repository.AwardRepository;
import com.dreamdevs.election.repository.VoteRepository;
import com.dreamdevs.election.repository.VoterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class VotingServiceTest {

    private VotingService votingService;
    private AwardService awardService;
    private VoterService voterService;
    private VoteRepository voteRepository;

    private Voter tunde;
    private Voter amaka;
    private Award award;

    @BeforeEach
    void setUp() {
        AwardRepository awardRepository = new AwardRepository();
        VoterRepository voterRepository = new VoterRepository();
        voteRepository = new VoteRepository();

        awardService = new AwardService(awardRepository);
        voterService = new VoterService(voterRepository);
        votingService = new VotingService(voteRepository, awardService, voterService);

        tunde = voterService.registerVoter("Tunde Bakare", "STU001");
        amaka = voterService.registerVoter("Amaka Obi", "STU002");
        award = awardService.createAward("Class Clown",
                List.of(Nominee.of("Tunde Bakare"), Nominee.of("Seun Kuti"), Nominee.of("Bola Ade")), false);
        awardService.openAward(award.getId());
    }

    @Test
    void castVote_withValidData_succeeds() {
        Vote vote = votingService.castVote(tunde.getId(), award.getId(), "Seun Kuti");

        assertNotNull(vote.getId());
        assertEquals(tunde.getId(), vote.getVoterId());
        assertEquals(award.getId(), vote.getAwardId());
        assertEquals("Seun Kuti", vote.getNomineeName());
    }

    @Test
    void castVote_voterVotesTwiceInSameAward_throwsElectionException() {
        votingService.castVote(tunde.getId(), award.getId(), "Seun Kuti");

        assertThrows(ElectionException.class, () ->
                votingService.castVote(tunde.getId(), award.getId(), "Bola Ade")
        );
    }

    @Test
    void castVote_inPendingAward_throwsElectionException() {
        Award pendingAward = awardService.createAward("Most Likely to Travel",
                List.of(Nominee.of("Ngozi"), Nominee.of("Emeka")), false);

        assertThrows(ElectionException.class, () ->
                votingService.castVote(tunde.getId(), pendingAward.getId(), "Ngozi")
        );
    }

    @Test
    void castVote_inClosedAward_throwsElectionException() {
        awardService.closeAward(award.getId());

        assertThrows(ElectionException.class, () ->
                votingService.castVote(tunde.getId(), award.getId(), "Seun Kuti")
        );
    }

    @Test
    void castVote_forNomineeNotInAward_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                votingService.castVote(tunde.getId(), award.getId(), "Random Person Not In List")
        );
    }

    @Test
    void castVote_deactivatedVoter_throwsElectionException() {
        voterService.deactivateVoter(tunde.getId());

        assertThrows(ElectionException.class, () ->
                votingService.castVote(tunde.getId(), award.getId(), "Seun Kuti")
        );
    }

    @Test
    void castVote_selfVote_succeeds() {
        Vote vote = votingService.castVote(tunde.getId(), award.getId(), "Tunde Bakare");

        assertNotNull(vote.getId());
        assertEquals("Tunde Bakare", vote.getNomineeName());
    }

    @Test
    void castVote_withNonExistentVoterId_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                votingService.castVote("ghost-voter-id", award.getId(), "Seun Kuti")
        );
    }

    @Test
    void castVote_withNonExistentAwardId_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                votingService.castVote(tunde.getId(), "ghost-award-id", "Seun Kuti")
        );
    }

    @Test
    void castVote_multipleVotersDifferentChoices_allSucceed() {
        votingService.castVote(tunde.getId(), award.getId(), "Seun Kuti");
        votingService.castVote(amaka.getId(), award.getId(), "Bola Ade");

        List<Vote> votes = voteRepository.findByAwardId(award.getId());
        assertEquals(2, votes.size());
    }
}
