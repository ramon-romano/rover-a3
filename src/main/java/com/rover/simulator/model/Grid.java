package com.rover.simulator.model;

import java.util.HashSet;
import java.util.Set;

public class Grid {
    private final int width;
    private final int height;
    private final Set<String> obstacles;

    public Grid(int width, int height) {
        this.width = width;
        this.height = height;
        this.obstacles = new HashSet<>();
    }

    public void addObstacle(int x, int y) {
        obstacles.add(x + "," + y);
    }

    public boolean isObstacle(int x, int y) {
        return obstacles.contains(x + "," + y);
    }

    public boolean isOutOfBounds(int x, int y) {
        return x < 0 || x >= width || y < 0 || y >= height;
    }

    public int getWidth() { return width; }
    public int getHeight() { return height; }
    public java.util.Set<String> getObstacles() { return obstacles; }
}
