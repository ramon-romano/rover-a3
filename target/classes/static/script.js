const API_URL = '/api/rover';
let gridSize = 20;

let roverPos = { x: 10, y: 10, dir: 'N' };
let obstacles = [];

const editor = document.getElementById('editor');
const runBtn = document.getElementById('run-btn');
const resetBtn = document.getElementById('reset-btn');
const clearBtn = document.getElementById('clear-btn');
const logsContainer = document.getElementById('logs');
const gridContainer = document.getElementById('grid');
const coordDisplay = document.getElementById('coord-display');
const dirDisplay = document.getElementById('dir-display');
const scanDisplay = document.getElementById('scan-display');
const errorOverlay = document.getElementById('error-overlay');
const errorMsg = document.getElementById('error-msg');
const closeError = document.getElementById('close-error');

async function init() {
  await fetchWorld();
  updateRoverVisual();
  
  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      appendSmartCommand(cmd);
    });
  });
}

function appendSmartCommand(newCmd) {
  const currentText = editor.value.trim();
  const lines = currentText.split("\n");
  const lastLine = lines[lines.length - 1] || "";
  
  const [newAction, newValStr] = newCmd.split(" ");
  const newVal = newValStr ? parseInt(newValStr) : null;

  if (lastLine && newVal !== null) {
    const [lastAction, lastValStr] = lastLine.split(" ");
    const lastVal = lastValStr ? parseInt(lastValStr) : null;

    if (lastAction === newAction && lastVal !== null) {
      lines[lines.length - 1] = `${lastAction} ${lastVal + newVal}`;
      editor.value = lines.join("\n");
      editor.scrollTop = editor.scrollHeight;
      return;
    }
  }

  editor.value += (editor.value ? "\n" : "") + newCmd;
  editor.scrollTop = editor.scrollHeight;
}

async function fetchWorld() {
  try {
    const res = await fetch(`${API_URL}/world`);
    const data = await res.json();
    gridSize = data.width;
    roverPos.x = data.startX || 10;
    roverPos.y = data.startY || 10;
    obstacles = Array.from(data.obstacles).map(s => {
      const [x, y] = s.split(',').map(Number);
      return { x, y };
    });
    renderGrid();
  } catch (err) {
    addLog("ERRO AO CARREGAR O MUNDO.", 'danger');
  }
}

function renderGrid() {
  gridContainer.innerHTML = '';
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.id = `cell-${x}-${y}`;
      if (obstacles.some(o => o.x === x && o.y === y)) cell.classList.add('obstacle');
      gridContainer.appendChild(cell);
    }
  }
  const roverEntity = document.createElement('div');
  roverEntity.id = 'rover-entity';
  gridContainer.appendChild(roverEntity);
}

function updateRoverVisual() {
  const rover = document.getElementById('rover-entity');
  if (!rover) return;
  const cellSize = 100 / gridSize;
  rover.style.width = `calc(${cellSize}% - 2px)`;
  rover.style.height = `calc(${cellSize}% - 2px)`;
  rover.style.top = `${roverPos.y * cellSize}%`;
  rover.style.left = `${roverPos.x * cellSize}%`;
  rover.className = `dir-${roverPos.dir}`;
  coordDisplay.textContent = `X: ${roverPos.x}, Y: ${roverPos.y}`;
  const dirNames = { 'N': 'NORTE', 'S': 'SUL', 'E': 'LESTE', 'W': 'OESTE' };
  dirDisplay.textContent = dirNames[roverPos.dir];
}

function addLog(text, type = 'move') {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString().split(' ')[0]}] ${text}`;
  logsContainer.appendChild(entry);
  logsContainer.scrollTop = logsContainer.scrollHeight;
}

async function runSimulation() {
  const script = editor.value.trim();
  if (!script) return;
  runBtn.disabled = true;
  runBtn.textContent = "PROCESSANDO...";
  addLog(">>> Transmitindo script...", 'system');
  try {
    const res = await fetch(`${API_URL}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script })
    });
    const result = await res.json();
    if (result.steps) await replaySteps(result.steps);
    if (!result.success || result.error) showError(result.error);
    else addLog("MISSÃO COMPLETA.", 'system');
  } catch (err) {
    addLog("ERRO DE CONEXÃO.", 'danger');
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = "LANÇAR MISSÃO";
  }
}

async function replaySteps(steps) {
  for (const step of steps) {
    roverPos.x = step.x; roverPos.y = step.y; roverPos.dir = step.dir;
    updateRoverVisual();
    let type = 'move';
    if (step.collision || step.outOfBounds) type = 'danger';
    else if (step.obstacleDetected !== undefined) {
      type = step.obstacleDetected ? 'warn' : 'system';
      scanDisplay.textContent = step.obstacleDetected ? "ALERTA" : "LIMPO";
      scanDisplay.style.color = step.obstacleDetected ? "var(--danger)" : "var(--success)";
    }
    addLog(step.log, type);
    await new Promise(r => setTimeout(r, 400));
  }
}

function showError(msg) {
  errorMsg.textContent = msg || "Erro na missão.";
  errorOverlay.classList.remove('hidden');
}

runBtn.addEventListener('click', runSimulation);

resetBtn.addEventListener('click', async () => {
  addLog("Gerando novo mundo aleatório...", 'system');
  const res = await fetch(`${API_URL}/reset`, { method: 'POST' });
  const data = await res.json();
  gridSize = data.width;
  roverPos = { x: data.startX || 10, y: data.startY || 10, dir: 'N' };
  obstacles = Array.from(data.obstacles).map(s => {
    const [x, y] = s.split(',').map(Number);
    return { x, y };
  });
  renderGrid();
  updateRoverVisual();
  scanDisplay.textContent = "READY"; 
  scanDisplay.style.color = "var(--accent-cyan)";
});

clearBtn.addEventListener('click', () => { 
  editor.value = ''; 
  addLog("Comandos limpos pelo operador.", 'system');
});

closeError.addEventListener('click', () => { errorOverlay.classList.add('hidden'); });

init();
