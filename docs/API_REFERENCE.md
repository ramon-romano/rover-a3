# Referência da API REST - Rover Simulator

A comunicação entre o frontend e o backend é feita através de uma API REST JSON.

## Endpoints Principais

### 1. Obter Mundo Atual
- **URL**: `/api/rover/world`
- **Método**: `GET`
- **Descrição**: Retorna o estado atual do mapa, incluindo dimensões, posição inicial do rover e localização dos obstáculos.
- **Resposta (200 OK)**:
  ```json
  {
    "width": 10,
    "height": 10,
    "startX": 1,
    "startY": 1,
    "obstacles": ["2,2", "5,5"]
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
      { "x": 1, "y": 2, "dir": "N", "log": "Movendo para 1, 2" },
      { "x": 1, "y": 2, "dir": "E", "log": "Girou para direita." }
    ],
    "error": null
  }
  ```

### 3. Resetar/Gerar Novo Mundo
- **URL**: `/api/rover/reset`
- **Método**: `POST`
- **Descrição**: Limpa o estado atual e gera um novo mapa com obstáculos aleatórios.
- **Resposta (200 OK)**: Dados do novo mundo (mesmo formato do `/world`).
