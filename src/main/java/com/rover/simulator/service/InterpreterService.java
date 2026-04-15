package com.rover.simulator.service;

import com.rover.simulator.model.Direction;
import com.rover.simulator.model.Grid;
import com.rover.simulator.model.Rover;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class InterpreterService {

    public static class SimulationStep {
        public int x, y;
        public String dir;
        public String log;
        public boolean obstacleDetected;
        public boolean collision;
        public boolean outOfBounds;
        public boolean sampleCollected;
        public List<String> newRevealedCells = new ArrayList<>();

        public SimulationStep(int x, int y, Direction dir, String log) {
            this.x = x;
            this.y = y;
            this.dir = dir.name();
            this.log = log;
        }
    }

    public static class SimulationResult {
        public List<SimulationStep> steps = new ArrayList<>();
        public String error = null;
        public boolean success = true;
        public int gridWidth;
        public int gridHeight;
        public Set<String> obstacles;
        public Set<String> samples;
        public Set<String> revealedCells;
    }

    public SimulationResult run(String script, Grid grid, Rover rover) {
        SimulationResult result = new SimulationResult();
        List<String> initialReveals = grid.revealCell(rover.getX(), rover.getY(), 1);
        SimulationStep firstStep = new SimulationStep(rover.getX(), rover.getY(), rover.getDirection(), "Pouso concluído. Iniciando missão.");
        firstStep.newRevealedCells.addAll(initialReveals);
        result.steps.add(firstStep);

        try {
            List<String> tokens = tokenize(script);
            if (tokens.isEmpty()) throw new Exception("Nenhum comando detectado no script.");
            execute(tokens, grid, rover, result, 0);
        } catch (Exception e) {
            result.success = false;
            result.error = e.getMessage();
        }

        return result;
    }

    private List<String> tokenize(String script) {
        List<String> tokens = new ArrayList<>();
        Pattern pattern = Pattern.compile("[a-zA-Z]+|\\d+|\\{|\\}");
        Matcher matcher = pattern.matcher(script.toUpperCase());
        while (matcher.find()) {
            tokens.add(matcher.group());
        }
        return tokens;
    }

    private int execute(List<String> tokens, Grid grid, Rover rover, SimulationResult result, int index) throws Exception {
        while (index < tokens.size()) {
            String token = tokens.get(index);

            if (token.equals("}")) {
                return index;
            }

            switch (token) {
                case "AVANCAR":
                    index = handleMove(tokens, index + 1, grid, rover, result, 1);
                    break;
                case "RECUAR":
                    index = handleMove(tokens, index + 1, grid, rover, result, -1);
                    break;
                case "ESQUERDA":
                    rover.setDirection(rover.getDirection().turnLeft());
                    result.steps.add(new SimulationStep(rover.getX(), rover.getY(), rover.getDirection(), "Girou para esquerda."));
                    index++;
                    break;
                case "DIREITA":
                    rover.setDirection(rover.getDirection().turnRight());
                    result.steps.add(new SimulationStep(rover.getX(), rover.getY(), rover.getDirection(), "Girou para direita."));
                    index++;
                    break;
                case "SCAN":
                    List<String> scanReveals = grid.revealCell(rover.getX(), rover.getY(), 3);
                    boolean detected = checkObstacleAhead(grid, rover);
                    SimulationStep detStep = new SimulationStep(rover.getX(), rover.getY(), rover.getDirection(), 
                        detected ? "SINAL RECEBIDO: Obstáculo detectado!" : "Scanner limpo. Área revelada num raio de 3 células.");
                    detStep.obstacleDetected = detected;
                    detStep.newRevealedCells.addAll(scanReveals);
                    result.steps.add(detStep);
                    index++;
                    break;  
                case "REPETIR":
                    index = handleFor(tokens, index + 1, grid, rover, result);
                    break;
                case "SE":
                    index = handleIf(tokens, index + 1, grid, rover, result);
                    break;
                case "COLETAR":
                    boolean coletou = grid.collectSample(rover.getX(), rover.getY());
                    SimulationStep coletarStep = new SimulationStep(rover.getX(), rover.getY(), rover.getDirection(), 
                        coletou ? "AMOSTRA COLETADA: Parabéns, você finalizou a missão!" : "Nenhuma amostra encontrada nesta posição.");
                    coletarStep.sampleCollected = coletou;
                    result.steps.add(coletarStep);
                    index++;
                    break;
                default:
                    throw new Exception("Comando não reconhecido: " + token);
            }

            if (!result.success) return tokens.size();
        }
        return index;
    }

    private int handleMove(List<String> tokens, int index, Grid grid, Rover rover, SimulationResult result, int multiplier) throws Exception {
        if (index >= tokens.size()) throw new Exception("Número de passos esperado após comando de movimento.");
        int steps;
        try {
            steps = Integer.parseInt(tokens.get(index));
        } catch (NumberFormatException e) {
            throw new Exception("Parâmetro inválido: " + tokens.get(index) + ". Esperado um número.");
        }

        for (int i = 0; i < steps; i++) {
            int nextX = rover.getX();
            int nextY = rover.getY();

            switch (rover.getDirection()) {
                case N -> nextY -= multiplier;
                case S -> nextY += multiplier;
                case E -> nextX += multiplier;
                case W -> nextX -= multiplier;
            }

            if (grid.isOutOfBounds(nextX, nextY)) {
                String errorMsg = "Bateu na parede do mapa em (" + nextX + "," + nextY + ")!";
                result.success = false;
                result.error = errorMsg;
                SimulationStep failStep = new SimulationStep(rover.getX(), rover.getY(), rover.getDirection(), errorMsg);
                failStep.outOfBounds = true;
                result.steps.add(failStep);
                return tokens.size();
            }

            if (grid.isObstacle(nextX, nextY)) {
                String errorMsg = "COLISÃO! O rover atingiu um obstáculo em (" + nextX + ", " + nextY + ")";
                result.success = false;
                result.error = errorMsg;
                SimulationStep failStep = new SimulationStep(rover.getX(), rover.getY(), rover.getDirection(), errorMsg);
                failStep.collision = true;
                result.steps.add(failStep);
                return tokens.size();
            }

            rover.setX(nextX);
            rover.setY(nextY);
            List<String> moveReveals = grid.revealCell(rover.getX(), rover.getY(), 1);
            SimulationStep moveStep = new SimulationStep(rover.getX(), rover.getY(), rover.getDirection(), "Movendo para " + rover.getX() + ", " + rover.getY());
            moveStep.newRevealedCells.addAll(moveReveals);
            result.steps.add(moveStep);
        }
        return index + 1;
    }

    private boolean checkObstacleAhead(Grid grid, Rover rover) {
        int nextX = rover.getX();
        int nextY = rover.getY();
        switch (rover.getDirection()) {
            case N -> nextY--;
            case S -> nextY++;
            case E -> nextX++;
            case W -> nextX--;
        }
        return grid.isObstacle(nextX, nextY) || grid.isOutOfBounds(nextX, nextY);
    }

    private int handleFor(List<String> tokens, int index, Grid grid, Rover rover, SimulationResult result) throws Exception {
        if (index >= tokens.size()) throw new Exception("Contagem esperada após REPETIR.");
        int count;
        try {
            count = Integer.parseInt(tokens.get(index));
        } catch (NumberFormatException e) {
            throw new Exception("Número esperado após REPETIR, mas encontrou: " + tokens.get(index));
        }
        index++;
        if (index >= tokens.size() || !tokens.get(index).equals("{")) throw new Exception("Símbolo '{' faltando após REPETIR.");
        index++;

        int loopStart = index;
        int lastIndex = index;
        for (int i = 0; i < count; i++) {
            lastIndex = execute(tokens, grid, rover, result, loopStart);
            if (!result.success) return tokens.size();
        }
        return lastIndex + 1;
    }

    private int handleIf(List<String> tokens, int index, Grid grid, Rover rover, SimulationResult result) throws Exception {
        if (index >= tokens.size() || !tokens.get(index).equals("OBSTACULO")) throw new Exception("Use 'SE OBSTACULO' para condicionais.");
        index++;
        if (index >= tokens.size() || !tokens.get(index).equals("{")) throw new Exception("Símbolo '{' faltando no bloco SE.");
        index++;

        boolean condition = checkObstacleAhead(grid, rover);
        int blockEnd;
        
        if (condition) {
            blockEnd = execute(tokens, grid, rover, result, index);
        } else {
            int depth = 1;
            int i = index;
            while (i < tokens.size() && depth > 0) {
                if (tokens.get(i).equals("{")) depth++;
                else if (tokens.get(i).equals("}")) depth--;
                i++;
            }
            blockEnd = i - 1;
        }
        
        index = blockEnd + 1;
        
        if (index < tokens.size() && tokens.get(index).equals("ELSE")) {
            index++;
            if (index >= tokens.size() || !tokens.get(index).equals("{")) throw new Exception("Símbolo '{' faltando no bloco ELSE.");
            index++;
            if (!condition) {
                index = execute(tokens, grid, rover, result, index) + 1;
            } else {
                int depth = 1;
                while (index < tokens.size() && depth > 0) {
                    if (tokens.get(index).equals("{")) depth++;
                    else if (tokens.get(index).equals("}")) depth--;
                    index++;
                }
            }
        }
        
        return index;
    }
}
