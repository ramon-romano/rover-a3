# Especificação da Linguagem RoverDSL

A RoverDSL é uma linguagem de domínio específico criada para controlar o rover em ambiente de simulador. É uma linguagem imperativa, case-insensitive (nos comandos principais) e suporta estruturas de controle.

## Comandos de Movimento
- `AVANCAR n`: Move o rover `n` unidades para frente (baseado na direção atual).
- `RECUAR n`: Move o rover `n` unidades para trás.
- `ESQUERDA`: Gira o rover 90 graus para a esquerda.
- `DIREITA`: Gira o rover 90 graus para a direita.
- `COLETAR`: Coleta o item encontrado no local.

## Sensoriamento
- `SCAN`: Verifica se há um obstáculo imediatamente à frente. Retorna o status para o painel de telemetria.

## Estruturas de Controle

### 1. Loop (REPETIR)
Repete um bloco de comandos um número específico de vezes.
**Sintaxe**:
```
REPETIR n {
  COMANDO_1
  ...
}
```

### 2. Condicional (SE)
Executa um bloco de comandos se a condição for verdadeira. Atualmente suporta a detecção de obstáculos.
**Sintaxe**:
```
SE OBSTACULO {
  COMANDO_SE_VERDADEIRO
} SE NÃO {
  COMANDO_SE_FALSO
}
```
*Nota: O bloco `SE NÃO` (também aceita `ELSE`, `SENÃO` ou `SENAO`) é opcional.*

## Exemplo de Missão Complexa
```
REPETIR 4 {
  AVANCAR 2
  SE OBSTACULO {
    ESQUERDA
    AVANCAR 1
    DIREITA
  }
}
```
