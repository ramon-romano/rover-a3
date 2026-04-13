# Arquitetura do Sistema - Rover Simulator A3

Este documento descreve a organização técnica do projeto, arquitetura de software e fluxo de dados.

## Visão Geral
O simulador é estruturado como uma aplicação **Monolítica Modular** seguindo o padrão **MVC (Model-View-Controller)** simplificado, utilizando Spring Boot para o backend e uma interface purista (Vanilla JS) para o frontend.

## Camadas do Sistema

### 1. Backend (Java / Spring Boot)
- **Model (`com.rover.simulator.model`)**: Contém as entidades principais do domínio.
    - `Rover`: Mantém o estado (posição X, Y e Direção).
    - `Grid`: Define o mapa, obstáculos, amostras coletáveis, células reveladas (Fog of War) e limites.
    - `Direction`: Enum para gerenciar as orientações (N, S, E, W) e lógica de giro.
- **Service (`com.rover.simulator.service`)**: A "inteligência" do sistema.
    - `InterpreterService`: Implementa um interpretador customizado (Lexer/Parser) para a RoverDSL. Suporta comandos de movimento, sensoriamento (SCAN com revelação de área), coleta de amostras (COLETAR) e estruturas de controle (REPETIR, SE/ELSE).
- **Controller (`com.rover.simulator.controller`)**: Exposição da API REST.
    - `RoverController`: Gerencia os endpoints de simulação, reset de mundo e telemetria.

### 2. Frontend (React + Vite)
- Localizado em `src/main/resources/static` e replicado em `/frontend`.
- **UI Futurista**: Utiliza Glassmorphism e fontes premium (Orbitron).
- **Simulação assíncrona**: O JavaScript envia o script completo, recebe todos os passos da simulação de uma vez e os "reproduz" com `setTimeout` para criar o efeito de movimentação em tempo real.

## Fluxo de Execução
1. O Operador digita comandos no editor web.
2. O script é enviado via POST JSON para `/api/rover/simulate`.
3. O `InterpreterService` tokeniza o script e executa cada comando virtualmente contra um objeto `Grid`.
4. É retornado um objeto `SimulationResult` contendo todos os estados intermediários (frames), obstáculos, amostras e células reveladas.
5. O Frontend interpreta a lista de passos e atualiza o DOM (posicionamento CSS e logs).

## Fog of War (Névoa de Guerra)
O sistema implementa um mecanismo de visibilidade limitada:
- **Pouso**: Ao iniciar a missão, o rover revela um raio de **1 célula** ao redor (3x3).
- **SCAN**: Ao executar o comando SCAN, o rover revela um raio de **4 células** ao redor (9x9).
- **Acumulativo**: Células reveladas permanecem visíveis durante toda a simulação.
- O frontend recebe apenas as células reveladas e deve esconder as demais.

## Objetivo da Missão
- O mapa contém **amostras** espalhadas aleatoriamente em posições válidas (sem obstáculos e fora da posição inicial).
- O rover pode coletar amostras com o comando `COLETAR` ou automaticamente ao mover-se sobre uma.
- Ao coletar, a missão é concluída com sucesso e a flag `sampleCollected` é sinalizada.
