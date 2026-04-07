# Simulador de Rover Espacial - Projeto A3

Este projeto é um simulador de movimentação de um rover em Marte (ou qualquer ambiente 2D), permitindo o envio de scripts de comando em uma linguagem customizada. O sistema valida a sintaxe, interpreta os comandos e simula a execução em tempo real em uma interface web futurista.

## 🚀 Tecnologias Utilizadas

- **Backend:** Java 17+ com Spring Boot 3.x
- **Frontend:** HTML5, CSS3 (Vanilla) e JavaScript (ES6+)
- **Estilo:** Glassmorphism, Neon UI, Animações CSS
- **Arquitetura:** REST API (Comunicação entre JS e Java)

## 🛠️ A Linguagem de Comando (RoverDSL)

A linguagem foi desenhada para ser intuitiva e poderosa, suportando movimentos básicos, detecção de obstáculos, laços de repetição e condicionais.

### Comandos Básicos
- `MOVE n`: Move o rover `n` posições para frente. (ex: `MOVE 2`)
- `BACK n`: Recua o rover `n` posições. (ex: `BACK 1`)
- `LEFT`: Gira o rover 90º para a esquerda.
- `RIGHT`: Gira o rover 90º para a direita.
- `DETECT`: Ativa o scanner frontal. Retorna se há obstáculo ou limite de mapa.

### Estruturas de Controle (Desafio Bônus)
- **Loops (FOR):** Repete um bloco de comandos.
  ```
  FOR 4 {
    MOVE 1
    RIGHT
  }
  ```
- **Condicionais (IF/ELSE):** Executa comandos baseados na detecção de obstáculos.
  ```
  IF OBSTACLE {
    LEFT
    MOVE 1
  } ELSE {
    MOVE 2
  }
  ```

## 🏗️ Estrutura do Projeto

```text
A3/
├── src/main/java/com/rover/simulator/
│   ├── model/           # Entidades (Rover, Grid, Direction)
│   ├── service/         # Lógica do Interpretador (Lexer/Parser)
│   ├── controller/      # API REST para simulação
│   └── RoverApplication.java  # Classe principal (Spring Boot)
├── src/main/resources/static/ # Front-end (UI do Simulador)
├── pom.xml              # Dependências do Maven
└── README.md            # Documentação
```

## 🚦 Como Executar

### Pré-requisitos
- **Java 17** ou superior instalado.
- **Maven** instalado (ou use uma IDE como IntelliJ/Eclipse).

### Passos
1. No terminal, navegue até a pasta raiz do projeto (`A3/`).
2. Execute o comando:
   ```bash
   mvn spring-boot:run
   ```
3. Assim que o servidor iniciar, abra o navegador em:
   **[http://localhost:8080/index.html](http://localhost:8080/index.html)**

## 🛡️ Tratamento de Erros
O sistema trata os seguintes cenários:
- **Comando Inválido:** Notifica via interface se um comando não for reconhecido.
- **Parâmetro Inválido:** Verifica se valores numéricos são válidos.
- **Sintaxe Incorreta:** Valida a abertura/fechamento de chaves e estrutura de comandos.
- **Colisão/Limites:** O rover para a missão se detectar colisão ou tentar sair do mapa 10x10.

---
*Desenvolvido como projeto A3 - Ciência da Computação.*
