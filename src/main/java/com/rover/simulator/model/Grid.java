package com.rover.simulator.model;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Grid {
    private final int width;
    private final int height;
    private final Set<String> obstacles;
    private final Set<String> samples;
    private final Set<String> revealedCells;

    public Grid(int width, int height) {
        this.width = width;
        this.height = height;
        this.obstacles = new HashSet<>();
        this.samples = new HashSet<>();
        this.revealedCells = new HashSet<>();
    }

    public void addObstacle(int x, int y) {
        obstacles.add(x + "," + y);
    }

    public void addSample(int x, int y) {
        samples.add(x + "," + y);
    }

    public List<String> revealCell(int centerX, int centerY, int radius) {
        List<String> newCells = new ArrayList<>();
        for (int x = centerX - radius; x <= centerX + radius; x++) {
            for (int y = centerY - radius; y <= centerY + radius; y++) {
                if (!isOutOfBounds(x, y)) {
                    String key = x + "," + y;
                    if (revealedCells.add(key)) {
                        newCells.add(key);
                    }
                }
            }
        }
        return newCells;
    }

    public boolean isRevealed(int x, int y) {
        return revealedCells.contains(x + "," + y);
    }

    public boolean isObstacle(int x, int y) {
        return obstacles.contains(x + "," + y);
    }

    public boolean collectSample(int x, int y) {
        return samples.remove(x + "," + y);
    }

    public boolean isOutOfBounds(int x, int y) {
        return x < 0 || x >= width || y < 0 || y >= height;
    }

    public int getWidth() { return width; }
    public int getHeight() { return height; }
    public java.util.Set<String> getObstacles() { return obstacles; }
    public java.util.Set<String> getSamples() { return samples; }
    public java.util.Set<String> getRevealedCells() { return revealedCells; }
}
