export const GRID_SIZE = 20;

export const Direction = Object.freeze({
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
});

export function createInitialState(gridSize = GRID_SIZE) {
  const start = Math.floor(gridSize / 2);
  const snake = [
    { x: start, y: start },
    { x: start - 1, y: start },
    { x: start - 2, y: start },
  ];

  return {
    gridSize,
    snake,
    direction: Direction.RIGHT,
    pendingDirection: Direction.RIGHT,
    food: spawnFood(snake, gridSize, 0),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function isOppositeDirection(current, next) {
  return current.x + next.x === 0 && current.y + next.y === 0;
}

export function setDirection(state, nextDirection) {
  if (state.isGameOver) {
    return state;
  }

  if (
    nextDirection.x === state.pendingDirection.x &&
    nextDirection.y === state.pendingDirection.y
  ) {
    return state;
  }

  if (isOppositeDirection(state.direction, nextDirection)) {
    return state;
  }

  return { ...state, pendingDirection: nextDirection };
}

export function stepState(state, randomValue = Math.random()) {
  if (state.isGameOver || state.isPaused) {
    return state;
  }

  const direction = state.pendingDirection;
  const head = state.snake[0];
  const nextHead = { x: head.x + direction.x, y: head.y + direction.y };
  const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const bodyToCheck = ateFood ? state.snake : state.snake.slice(0, -1);

  if (hitsBoundary(nextHead, state.gridSize) || hitsSelf(nextHead, bodyToCheck)) {
    return {
      ...state,
      direction,
      isGameOver: true,
    };
  }

  const nextSnake = [nextHead, ...state.snake];

  if (!ateFood) {
    nextSnake.pop();
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    food: ateFood ? spawnFood(nextSnake, state.gridSize, randomValue) : state.food,
    score: ateFood ? state.score + 1 : state.score,
  };
}

export function togglePause(state) {
  if (state.isGameOver) {
    return state;
  }

  return {
    ...state,
    isPaused: !state.isPaused,
  };
}

export function spawnFood(snake, gridSize, randomValue = Math.random()) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const freeCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return { x: -1, y: -1 };
  }

  const index = Math.min(
    freeCells.length - 1,
    Math.floor(Math.max(0, Math.min(0.999999, randomValue)) * freeCells.length)
  );

  return freeCells[index];
}

export function hitsBoundary(position, gridSize) {
  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= gridSize ||
    position.y >= gridSize
  );
}

export function hitsSelf(head, snake) {
  return snake.some((segment) => segment.x === head.x && segment.y === head.y);
}
