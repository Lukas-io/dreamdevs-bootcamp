package com.dreamdevs.election.repository;

import com.dreamdevs.election.model.Award;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public class AwardRepository {
    private final Map<String, Award> store = new HashMap<>();

    public Award save(Award award) {
        store.put(award.getId(), award);
        return award;
    }

    public Optional<Award> findById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public List<Award> findAll() {
        return new ArrayList<>(store.values());
    }

    public void deleteById(String id) {
        store.remove(id);
    }

    public void clear() {
        store.clear();
    }
}
