package com.dreamdevs.election.model;

import java.util.UUID;

public class Vote {
    private final String id;
    private final String voterId;
    private final String awardId;
    private final String nomineeName;

    public Vote(String voterId, String awardId, String nomineeName) {
        this.id = UUID.randomUUID().toString();
        this.voterId = voterId;
        this.awardId = awardId;
        this.nomineeName = nomineeName;
    }

    public String getId() { return id; }
    public String getVoterId() { return voterId; }
    public String getAwardId() { return awardId; }
    public String getNomineeName() { return nomineeName; }
}
