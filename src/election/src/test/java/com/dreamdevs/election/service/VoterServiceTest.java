package com.dreamdevs.election.service;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Voter;
import com.dreamdevs.election.repository.VoterRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class VoterServiceTest {

    private VoterService voterService;
    private VoterRepository voterRepository;

    @BeforeEach
    void setUp() {
        voterRepository = new VoterRepository();
        voterService = new VoterService(voterRepository);
    }

    @Test
    void registerVoter_withValidData_succeeds() {
        Voter voter = voterService.registerVoter("Tunde Bakare", "STU001");

        assertNotNull(voter.getId());
        assertEquals("Tunde Bakare", voter.getName());
        assertEquals("STU001", voter.getStudentId());
        assertTrue(voter.isActive());
    }

    @Test
    void registerVoter_withDuplicateStudentId_throwsElectionException() {
        voterService.registerVoter("Tunde Bakare", "STU001");

        assertThrows(ElectionException.class, () ->
                voterService.registerVoter("Tunde Clone", "STU001")
        );
    }

    @Test
    void registerVoter_withEmptyName_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                voterService.registerVoter("", "STU002")
        );
    }

    @Test
    void registerVoter_withEmptyStudentId_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                voterService.registerVoter("Amaka Obi", "")
        );
    }

    @Test
    void deactivateVoter_setsActiveToFalse() {
        Voter voter = voterService.registerVoter("Ngozi Eze", "STU003");

        voterService.deactivateVoter(voter.getId());

        assertFalse(voterService.getVoter(voter.getId()).isActive());
    }

    @Test
    void deactivateVoter_withNonExistentId_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                voterService.deactivateVoter("ghost-id")
        );
    }

    @Test
    void getVoter_withNonExistentId_throwsElectionException() {
        assertThrows(ElectionException.class, () ->
                voterService.getVoter("ghost-id")
        );
    }

    @Test
    void listVoters_returnsAllRegisteredVoters() {
        voterService.registerVoter("Tunde Bakare", "STU001");
        voterService.registerVoter("Amaka Obi", "STU002");
        voterService.registerVoter("Chidi Nwosu", "STU003");

        List<Voter> voters = voterService.listVoters();

        assertEquals(3, voters.size());
    }

    @Test
    void listVoters_whenNoneRegistered_returnsEmptyList() {
        assertTrue(voterService.listVoters().isEmpty());
    }
}
