package com.dreamdevs.election.model;

import java.util.UUID;

public class Voter {
    private final String id;
    private String name;
    private String studentId;
    private boolean active;

    public Voter(String name, String studentId) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.studentId = studentId;
        this.active = true;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getStudentId() { return studentId; }
    public boolean isActive() { return active; }

    public void setActive(boolean active) { this.active = active; }
}
