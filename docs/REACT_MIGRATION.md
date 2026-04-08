# Guia de Migração para React (Vite)

Este documento serve como base para migrar o simulador de Rover para React.

## Configuração Inicial Recomendada

Para um ambiente moderno e rápido, sugerimos o uso do **Vite**:

```bash
# Navegue até a pasta frontend
cd frontend

# Inicie um novo projeto Vite na pasta atual
npm create vite@latest . -- --template react

# Instale as dependências
npm install
```

## Integração com a API Java (Spring Boot)

O backend já está configurado para aceitar requisições de outras origens (CORS habilitado).

### Exemplo de Fetching no React

```jsx
import { useState, useEffect } from 'react'

const RoverMission = () => {
  const [world, setWorld] = useState(null);
  const [running, setRunning] = useState(false);

  // Carregar o mundo inicial
  useEffect(() => {
    fetch('http://localhost:8080/api/rover/world')
      .then(res => res.json())
      .then(data => setWorld(data));
  }, []);

  const runScript = async (script) => {
    setRunning(true);
    const response = await fetch('http://localhost:8080/api/rover/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script })
    });
    const result = await response.json();
    
    // O backend retorna todos os 'steps' da simulação.
    // Use um loop ou intervalo para animar o estado do Rover no grid.
    animateSteps(result.steps);
    setRunning(false);
  };

  return (
    <div>
      {/* Sua UI do Rover aqui */}
    </div>
  );
};
```

## Observações de Estilo
Os arquivos `styles.css` originais usam variáveis `:root` (como `--accent-cyan`). Você pode importá-los diretamente no seu arquivo `App.jsx` ou `main.jsx` para reaproveitar a identidade visual futurista.

## Dica: Proxy no Vite
Para evitar ter que digitar o URL completo em cada fetch, adicione um proxy no `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
})
```
Isso permite usar apenas `fetch('/api/rover/world')`.
