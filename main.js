import {
  GRID_SIZE,
  Direction,
  createInitialState,
  setDirection,
  stepState,
  togglePause,
} from './snakeLogic.js';

const SPEED_TO_TICK_MS = {
  1: 220,
  2: 170,
  3: 130,
  4: 95,
  5: 70,
};
const DEFAULT_SPEED_LEVEL = 3;

const gridEl = document.querySelector('[data-grid]');
const scoreEl = document.querySelector('[data-score]');
const statusEl = document.querySelector('[data-status]');
const speedLabelEl = document.querySelector('[data-speed-label]');
const restartBtn = document.querySelector('[data-restart]');
const pauseBtn = document.querySelector('[data-pause]');
const controlButtons = document.querySelectorAll('[data-dir]');
const speedButtons = document.querySelectorAll('[data-speed]');

let state = createInitialState(GRID_SIZE);
let speedLevel = DEFAULT_SPEED_LEVEL;

function render() {
  scoreEl.textContent = String(state.score);
  speedLabelEl.textContent = String(speedLevel);

  if (state.isGameOver) {
    statusEl.textContent = '게임 오버';
  } else if (state.isPaused) {
    statusEl.textContent = '일시정지';
  } else {
    statusEl.textContent = '진행 중';
  }

  gridEl.innerHTML = '';

  for (let y = 0; y < state.gridSize; y += 1) {
    for (let x = 0; x < state.gridSize; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (state.food.x === x && state.food.y === y) {
        cell.classList.add('food');
      }

      const index = state.snake.findIndex((segment) => segment.x === x && segment.y === y);
      if (index !== -1) {
        cell.classList.add(index === 0 ? 'head' : 'snake');
      }

      gridEl.appendChild(cell);
    }
  }

  pauseBtn.textContent = state.isPaused ? '재개' : '일시정지';

  speedButtons.forEach((button) => {
    const buttonLevel = Number(button.getAttribute('data-speed'));
    const isActive = buttonLevel === speedLevel;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function handleDirection(direction) {
  state = setDirection(state, direction);
}

function tick() {
  state = stepState(state);
  render();
}

function gameLoop() {
  tick();
  setTimeout(gameLoop, SPEED_TO_TICK_MS[speedLevel]);
}

function restart() {
  state = createInitialState(GRID_SIZE);
  render();
}

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();

  if (key === 'arrowup' || key === 'w') {
    event.preventDefault();
    handleDirection(Direction.UP);
  } else if (key === 'arrowdown' || key === 's') {
    event.preventDefault();
    handleDirection(Direction.DOWN);
  } else if (key === 'arrowleft' || key === 'a') {
    event.preventDefault();
    handleDirection(Direction.LEFT);
  } else if (key === 'arrowright' || key === 'd') {
    event.preventDefault();
    handleDirection(Direction.RIGHT);
  } else if (key === ' ') {
    event.preventDefault();
    state = togglePause(state);
    render();
  } else if (key === 'r') {
    restart();
  }
});

controlButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const dir = button.getAttribute('data-dir');
    if (dir === 'up') handleDirection(Direction.UP);
    if (dir === 'down') handleDirection(Direction.DOWN);
    if (dir === 'left') handleDirection(Direction.LEFT);
    if (dir === 'right') handleDirection(Direction.RIGHT);
  });
});

restartBtn.addEventListener('click', restart);
pauseBtn.addEventListener('click', () => {
  state = togglePause(state);
  render();
});

speedButtons.forEach((button) => {
  button.addEventListener('click', () => {
    speedLevel = Number(button.getAttribute('data-speed'));
    render();
  });
});

setTimeout(gameLoop, SPEED_TO_TICK_MS[speedLevel]);
render();
