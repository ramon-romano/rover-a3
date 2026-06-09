package com.rover.simulator.service;

import com.rover.simulator.model.Direction;
import com.rover.simulator.model.Grid;
import com.rover.simulator.model.Rover;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class InterpreterServiceTest {

    @Test
    public void testElseBlockWithObstacleAhead() {
        InterpreterService interpreter = new InterpreterService();

        // 1. Test "SE NÃO" with obstacle ahead (condition is true, should run IF block, NOT ELSE)
        Grid grid = new Grid(20, 20);
        grid.addObstacle(10, 9); // Obstacle ahead (Rover starts at 10,10 facing NORTH)
        Rover rover = new Rover(10, 10, Direction.N);

        String script = "SE OBSTACULO { ESQUERDA } SE NÃO { AVANCAR 1 }";
        InterpreterService.SimulationResult result = interpreter.run(script, grid, rover);

        assertTrue(result.success, "Simulation should succeed");
        assertEquals(Direction.W, rover.getDirection(), "Should turn left");
        assertEquals(10, rover.getX(), "Should not advance");
        assertEquals(10, rover.getY(), "Should not advance");
    }

    @Test
    public void testElseBlockWithoutObstacleAhead() {
        InterpreterService interpreter = new InterpreterService();

        // 2. Test "SE NÃO" without obstacle (condition is false, should run ELSE/SE NÃO block)
        Grid grid = new Grid(20, 20);
        Rover rover = new Rover(10, 10, Direction.N);

        String script = "SE OBSTACULO { ESQUERDA } SE NÃO { AVANCAR 1 }";
        InterpreterService.SimulationResult result = interpreter.run(script, grid, rover);

        assertTrue(result.success, "Simulation should succeed");
        assertEquals(Direction.N, rover.getDirection(), "Should not turn");
        assertEquals(10, rover.getX(), "X should remain 10");
        assertEquals(9, rover.getY(), "Rover should advance to Y=9");
    }

    @Test
    public void testSenaoAccentBlock() {
        InterpreterService interpreter = new InterpreterService();

        Grid grid = new Grid(20, 20);
        Rover rover = new Rover(10, 10, Direction.N);

        String script = "SE OBSTACULO { ESQUERDA } SENÃO { AVANCAR 1 }";
        InterpreterService.SimulationResult result = interpreter.run(script, grid, rover);

        assertTrue(result.success);
        assertEquals(Direction.N, rover.getDirection());
        assertEquals(9, rover.getY());
    }

    @Test
    public void testSenaoNoAccentBlock() {
        InterpreterService interpreter = new InterpreterService();

        Grid grid = new Grid(20, 20);
        Rover rover = new Rover(10, 10, Direction.N);

        String script = "SE OBSTACULO { ESQUERDA } SENAO { AVANCAR 1 }";
        InterpreterService.SimulationResult result = interpreter.run(script, grid, rover);

        assertTrue(result.success);
        assertEquals(Direction.N, rover.getDirection());
        assertEquals(9, rover.getY());
    }

    @Test
    public void testElseKeywordBlock() {
        InterpreterService interpreter = new InterpreterService();

        Grid grid = new Grid(20, 20);
        Rover rover = new Rover(10, 10, Direction.N);

        String script = "SE OBSTACULO { ESQUERDA } ELSE { AVANCAR 1 }";
        InterpreterService.SimulationResult result = interpreter.run(script, grid, rover);

        assertTrue(result.success);
        assertEquals(Direction.N, rover.getDirection());
        assertEquals(9, rover.getY());
    }

    @Test
    public void testAccentsInConditionalAndCommands() {
        InterpreterService interpreter = new InterpreterService();

        Grid grid = new Grid(20, 20);
        grid.addObstacle(10, 9);
        Rover rover = new Rover(10, 10, Direction.N);

        // Test with full accents on OBSTÁCULO, SE NÃO, AVANÇAR
        String script = "SE OBSTÁCULO { ESQUERDA } SE NÃO { AVANÇAR 1 }";
        InterpreterService.SimulationResult result = interpreter.run(script, grid, rover);

        assertTrue(result.success, "Simulation should succeed with accents");
        assertEquals(Direction.W, rover.getDirection());
        assertEquals(10, rover.getX());
        assertEquals(10, rover.getY());
    }
}
