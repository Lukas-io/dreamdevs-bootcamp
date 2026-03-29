package com.dreamdevs.election.repository;

import com.dreamdevs.election.model.Vote;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Repository
public class VoteRepository {
    private final List<Vote> store = new ArrayList<>();

    public Vote save(Vote vote) {
        store.add(vote);
        return vote;
    }

    public List<Vote> findByAwardId(String awardId) {
        return store.stream()
                .filter(v -> v.getAwardId().equals(awardId))
                .collect(Collectors.toList());
    }

    public boolean existsByVoterIdAndAwardId(String voterId, String awardId) {
        return store.stream()
                .anyMatch(v -> v.getVoterId().equals(voterId) && v.getAwardId().equals(awardId));
    }

    public List<Vote> findAll() {
        return new ArrayList<>(store);
    }

    public void clear() {
        store.clear();
    }
}
