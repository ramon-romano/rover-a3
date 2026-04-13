# Simulador de Rover Espacial - Projeto A3

Este projeto é um simulador de movimentação de um rover em Marte (ou qualquer ambiente 2D), permitindo o envio de scripts de comando em uma linguagem customizada. O sistema valida a sintaxe, interpreta os comandos e simula a execução em tempo real em uma interface web futurista.

## 🚀 Tecnologias Utilizadas

- **Backend:** Java 17+ com Spring Boot 3.x
- **Frontend:** React + Vite
- **Estilo:** Glassmorphism, Neon UI, Animações CSS
- **Arquitetura:** REST API (Comunicação entre JS e Java)

## 🛠️ A Linguagem de Comando (RoverDSL)

A linguagem foi desenhada para ser intuitiva e poderosa, suportando movimentos básicos, detecção de obstáculos, laços de repetição e condicionais.

### Comandos Básicos
- `AVANCAR n`: Move o rover `n` posições para frente. (ex: `AVANCAR 2`)
- `RECUAR n`: Recua o rover `n` posições. (ex: `RECUAR 1`)
- `ESQUERDA`: Gira o rover 90º para a esquerda.
- `DIREITA`: Gira o rover 90º para a direita.
- `SCAN`: Ativa o scanner frontal. Retorna se há obstáculo ou limite de mapa.
- `COLETAR`: Coleta o item encontrado no local.

### Estruturas de Controle (Desafio Bônus)
- **Loops (REPETIR):** Repete um bloco de comandos.
  ```
  REPETIR 4 {
    AVANCAR 1
    DIREITA
  }
  ```
- **Condicionais (SE/ELSE):** Executa comandos baseados na detecção de obstáculos.
  ```
  SE OBSTACULO {
    ESQUERDA
    AVANCAR 1
  } ELSE {
    AVANCAR 2
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
   .\mvnw spring-boot:run
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
