package com.dreamdevs.election.service;

import com.dreamdevs.election.exception.ElectionException;
import com.dreamdevs.election.model.Voter;
import com.dreamdevs.election.repository.VoterRepository;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

@Service
public class VoterService {

    private final VoterRepository voterRepository;

    public VoterService(VoterRepository voterRepository) {
        this.voterRepository = voterRepository;
    }

    public Voter signup(String name, String studentId, String password, String imageUrl) {
        if (name == null || name.isBlank()) throw new ElectionException("Voter name cannot be empty.");
        if (studentId == null || studentId.isBlank()) throw new ElectionException("Student ID cannot be empty.");
        if (password == null || password.length() < 4) throw new ElectionException("Password must be at least 4 characters.");
        if (voterRepository.findByStudentId(studentId).isPresent()) {
            throw new ElectionException("A voter with student ID '" + studentId + "' is already registered.");
        }
        String hash = hashPassword(password);
        return voterRepository.save(new Voter(name, studentId, hash, imageUrl));
    }

    public Voter login(String studentId, String password) {
        Voter voter = voterRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ElectionException("Invalid credentials."));
        if (voter.getPasswordHash() == null || !checkPassword(password, voter.getPasswordHash())) {
            throw new ElectionException("Invalid credentials.");
        }
        if (!voter.isActive()) {
            throw new ElectionException("Account is deactivated.");
        }
        return voter;
    }

    public Voter registerVoter(String name, String studentId) {
        return registerVoter(name, studentId, null);
    }

    public Voter registerVoter(String name, String studentId, String imageUrl) {
        if (name == null || name.isBlank()) throw new ElectionException("Voter name cannot be empty.");
        if (studentId == null || studentId.isBlank()) throw new ElectionException("Student ID cannot be empty.");
        if (voterRepository.findByStudentId(studentId).isPresent()) {
            throw new ElectionException("A voter with student ID '" + studentId + "' is already registered.");
        }
        Voter voter = new Voter(name, studentId);
        voter.setImageUrl(imageUrl);
        return voterRepository.save(voter);
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

    private String hashPassword(String password) {
        try {
            byte[] salt = new byte[16];
            new SecureRandom().nextBytes(salt);
            byte[] hash = pbkdf2(password.toCharArray(), salt);
            return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Password hashing failed", e);
        }
    }

    private boolean checkPassword(String password, String storedHash) {
        try {
            String[] parts = storedHash.split(":");
            if (parts.length != 2) return false;
            byte[] salt = Base64.getDecoder().decode(parts[0]);
            byte[] expected = Base64.getDecoder().decode(parts[1]);
            byte[] actual = pbkdf2(password.toCharArray(), salt);
            return MessageDigest.isEqual(expected, actual);
        } catch (Exception e) {
            return false;
        }
    }

    private byte[] pbkdf2(char[] password, byte[] salt) throws Exception {
        PBEKeySpec spec = new PBEKeySpec(password, salt, 65536, 256);
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        byte[] hash = factory.generateSecret(spec).getEncoded();
        spec.clearPassword();
        return hash;
    }
}
