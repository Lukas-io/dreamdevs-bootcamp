package com.dreamdevs.election.model;

public class Nominee {
    private String name;
    private String imageUrl;

    public Nominee() {}

    public Nominee(String name, String imageUrl) {
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public static Nominee of(String name) {
        return new Nominee(name, null);
    }

    public String getName() { return name; }
    public String getImageUrl() { return imageUrl; }
    public void setName(String name) { this.name = name; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
