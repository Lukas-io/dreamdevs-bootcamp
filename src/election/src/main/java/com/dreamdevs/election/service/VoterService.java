package com.dreamdevs.election.service;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Voter;
import com.dreamdevs.election.repository.VoterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoterService {

    private final VoterRepository voterRepository;

    public VoterService(VoterRepository voterRepository) {
        this.voterRepository = voterRepository;
    }

    public Voter registerVoter(String name, String studentId) {
        if (name == null || name.isBlank()) {
            throw new ElectionException("Voter name cannot be empty.");
        }
        if (studentId == null || studentId.isBlank()) {
            throw new ElectionException("Student ID cannot be empty.");
        }
        if (voterRepository.findByStudentId(studentId).isPresent()) {
            throw new ElectionException("A voter with student ID '" + studentId + "' is already registered.");
        }
        return voterRepository.save(new Voter(name, studentId));
    }

    public Voter getVoter(String id) {
        return voterRepository.findById(id)
                .orElseThrow(() -> new ElectionException("Voter not found: " + id));
    }

    public List<Voter> listVoters() {
        return voterRepository.findAll();
    }

    public void deactivateVoter(String id) {
        Voter voter = getVoter(id);
        voter.setActive(false);
        voterRepository.save(voter);
    }
}
