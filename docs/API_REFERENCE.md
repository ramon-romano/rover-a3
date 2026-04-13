# Referência da API REST - Rover Simulator

A comunicação entre o frontend e o backend é feita através de uma API REST JSON.

## Endpoints Principais

### 1. Obter Mundo Atual
- **URL**: `/api/rover/world`
- **Método**: `GET`
- **Descrição**: Retorna o estado atual do mapa, incluindo dimensões, posição inicial do rover, obstáculos, amostras e células reveladas.
- **Resposta (200 OK)**:
  ```json
  {
    "width": 20,
    "height": 20,
    "startX": 10,
    "startY": 10,
    "obstacles": ["2,2", "5,5"],
    "samples": ["7,3"],
    "revealedCells": ["9,9", "10,9", "11,9", "9,10", "10,10", "11,10", "9,11", "10,11", "11,11"]
  }
  ```

### 2. Executar Simulação
- **URL**: `/api/rover/simulate`
- **Método**: `POST`
- **Descrição**: Recebe um script RoverDSL e retorna a sequência de passos para animação.
- **Corpo da Requisição**:
  ```json
  {
    "script": "AVANCAR 2\nDIREITA\nAVANCAR 1"
  }
  ```
- **Resposta (200 OK)**:
  ```json
  {
    "success": true,
    "steps": [
      {
        "x": 10, "y": 9, "dir": "N",
        "log": "Movendo para 10, 9",
        "obstacleDetected": false,
        "collision": false,
        "outOfBounds": false,
        "sampleCollected": false
      }
    ],
    "error": null,
    "gridWidth": 20,
    "gridHeight": 20,
    "obstacles": ["2,2", "5,5"],
    "samples": ["7,3"],
    "revealedCells": ["9,9", "10,10", "11,11"]
  }
  ```

### 3. Resetar/Gerar Novo Mundo
- **URL**: `/api/rover/reset`
- **Método**: `POST`
- **Descrição**: Limpa o estado atual e gera um novo mapa com obstáculos e amostras aleatórias.
- **Resposta (200 OK)**: Dados do novo mundo (mesmo formato do `/world`).
