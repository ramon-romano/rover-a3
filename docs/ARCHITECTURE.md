# Arquitetura do Sistema - Rover Simulator A3

Este documento descreve a organização técnica do projeto, arquitetura de software e fluxo de dados.

## Visão Geral
O simulador é estruturado como uma aplicação **Monolítica Modular** seguindo o padrão **MVC (Model-View-Controller)** simplificado, utilizando Spring Boot para o backend e uma interface purista (Vanilla JS) para o frontend.

## Camadas do Sistema

### 1. Backend (Java / Spring Boot)
- **Model (`com.rover.simulator.model`)**: Contém as entidades principais do domínio.
    - `Rover`: Mantém o estado (posição X, Y e Direção).
    - `Grid`: Define o mapa, obstáculos e limites.
    - `Direction`: Enum para gerenciar as orientações (N, S, E, W) e lógica de giro.
- **Service (`com.rover.simulator.service`)**: A "inteligência" do sistema.
    - `InterpreterService`: Implementa um interpretador customizado (Lexer/Parser) para a RoverDSL. Processa o script e gera uma lista de passos para animação.
- **Controller (`com.rover.simulator.controller`)**: Exposição da API REST.
    - `RoverController`: Gerencia os endpoints de simulação, reset de mundo e telemetria.

### 2. Frontend (HTML/CSS/JS)
- Localizado em `src/main/resources/static` e replicado em `/frontend`.
- **UI Futurista**: Utiliza Glassmorphism e fontes premium (Orbitron).
- **Simulação assíncrona**: O JavaScript envia o script completo, recebe todos os passos da simulação de uma vez e os "reproduz" com `setTimeout` para criar o efeito de movimentação em tempo real.

## Fluxo de Execução
1. O Operador digita comandos no editor web.
2. O script é enviado via POST JSON para `/api/rover/simulate`.
3. O `InterpreterService` tokeniza o script e executa cada comando virtualmente contra um objeto `Grid`.
4. É retornado um objeto `SimulationResult` contendo todos os estados intermediários (frames).
5. O Frontend interpreta a lista de passos e atualiza o DOM (posicionamento CSS e logs).
