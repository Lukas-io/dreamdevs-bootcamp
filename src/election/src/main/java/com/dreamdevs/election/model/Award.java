package com.dreamdevs.election.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Award {
    private final String id;
    private String title;
    private List<String> nominees;
    private AwardStatus status;
    private boolean revealed;
    private boolean anonymous;

    public Award(String title, List<String> nominees, boolean anonymous) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.nominees = new ArrayList<>(nominees);
        this.status = AwardStatus.PENDING;
        this.revealed = false;
        this.anonymous = anonymous;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public List<String> getNominees() { return nominees; }
    public AwardStatus getStatus() { return status; }
    public boolean isRevealed() { return revealed; }
    public boolean isAnonymous() { return anonymous; }

    public void setStatus(AwardStatus status) { this.status = status; }
    public void setRevealed(boolean revealed) { this.revealed = revealed; }
}
