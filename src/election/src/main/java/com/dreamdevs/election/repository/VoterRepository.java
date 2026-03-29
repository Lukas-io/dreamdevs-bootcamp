package com.dreamdevs.election.repository;

import com.dreamdevs.election.model.Voter;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class VoterRepository {
    private final Map<String, Voter> store = new HashMap<>();

    public Voter save(Voter voter) {
        store.put(voter.getId(), voter);
        return voter;
    }

    public Optional<Voter> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public Optional<Voter> findByStudentId(String studentId) {
        return store.values().stream()
                .filter(v -> v.getStudentId().equals(studentId))
                .findFirst();
    }

    public List<Voter> findAll() {
        return new ArrayList<>(store.values());
    }

    public void clear() {
        store.clear();
    }
}
