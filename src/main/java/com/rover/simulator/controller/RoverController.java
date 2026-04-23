package com.rover.simulator.controller;

import com.rover.simulator.model.Direction;
import com.rover.simulator.model.Grid;
import com.rover.simulator.model.Rover;
import com.rover.simulator.service.InterpreterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/rover")
@CrossOrigin(origins = "*")
public class RoverController {

    @Autowired
    private InterpreterService interpreterService;

    private Grid currentGrid;

    @PostMapping("/simulate")
    public InterpreterService.SimulationResult simulate(@RequestBody Map<String, Object> payload) {
        String script = (String) payload.get("script");
        
        if (currentGrid == null) generateNewWorld();

        Rover rover = new Rover(10, 10, Direction.N);
        InterpreterService.SimulationResult result = interpreterService.run(script, currentGrid, rover);
        
        result.gridWidth = currentGrid.getWidth();
        result.gridHeight = currentGrid.getHeight();
        result.obstacles = currentGrid.getObstacles();
        result.samples = currentGrid.getSamples();
        result.revealedCells = currentGrid.getRevealedCells();

        return result;
    }

    @GetMapping("/world")
    public Map<String, Object> getWorld() {
        if (currentGrid == null) generateNewWorld();
        Map<String, Object> response = new HashMap<>();
        response.put("width", currentGrid.getWidth());
        response.put("height", currentGrid.getHeight());
        response.put("obstacles", currentGrid.getObstacles());
        response.put("samples", currentGrid.getSamples());
        response.put("startX", 10);
        response.put("startY", 10);
        response.put("revealedCells", currentGrid.getRevealedCells());
        return response;
    }

    @PostMapping("/reset")
    public Map<String, Object> resetWorld() {
        generateNewWorld();
        return getWorld();
    }

    private void generateNewWorld() {
        int size = 20;
        currentGrid = new Grid(size, size);
        Random rand = new Random();
        int obstacleCount = 60 + rand.nextInt(40);
        
        for (int i = 0; i < obstacleCount; i++) {
            int x = rand.nextInt(size);
            int y = rand.nextInt(size);
            if (x == 10 && y == 10) continue;
            currentGrid.addObstacle(x, y);
        }
        
        int sampleX, sampleY;
        do {
            sampleX = rand.nextInt(size);
            sampleY = rand.nextInt(size);
        } while (currentGrid.isObstacle(sampleX, sampleY) || (sampleX == 10 && sampleY == 10));
        currentGrid.addSample(sampleX, sampleY);

        // Reveal initial 3x3 area around rover start so the map isn't fully dark on load
        currentGrid.revealCell(10, 10, 1);
    }
}
