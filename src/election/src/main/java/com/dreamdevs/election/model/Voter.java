package com.dreamdevs.election.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.UUID;

public class Voter {
    private final String id;
    private String name;
    private String studentId;
    private boolean active;
    private String passwordHash;
    private String imageUrl;

    public Voter(String name, String studentId) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.studentId = studentId;
        this.active = true;
    }

    public Voter(String name, String studentId, String passwordHash, String imageUrl) {
        this(name, studentId);
        this.passwordHash = passwordHash;
        this.imageUrl = imageUrl;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getStudentId() { return studentId; }
    public boolean isActive() { return active; }
    public String getImageUrl() { return imageUrl; }

    @JsonIgnore
    public String getPasswordHash() { return passwordHash; }

    public void setActive(boolean active) { this.active = active; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
