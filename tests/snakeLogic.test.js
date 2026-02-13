import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Direction,
  createInitialState,
  setDirection,
  stepState,
  spawnFood,
} from '../snakeLogic.js';

test('snake moves one cell in current direction', () => {
  const state = createInitialState(10);
  const next = stepState(state, 0);

  assert.equal(next.snake[0].x, state.snake[0].x + 1);
  assert.equal(next.snake[0].y, state.snake[0].y);
  assert.equal(next.snake.length, state.snake.length);
  assert.equal(next.isGameOver, false);
});

test('snake grows and score increments when eating food', () => {
  const state = createInitialState(10);
  const forced = {
    ...state,
    food: { x: state.snake[0].x + 1, y: state.snake[0].y },
  };

  const next = stepState(forced, 0);

  assert.equal(next.snake.length, forced.snake.length + 1);
  assert.equal(next.score, forced.score + 1);
  assert.notDeepEqual(next.food, forced.food);
});

test('opposite direction input is ignored', () => {
  const state = createInitialState(10);
  const next = setDirection(state, Direction.LEFT);

  assert.equal(next.pendingDirection.x, Direction.RIGHT.x);
  assert.equal(next.pendingDirection.y, Direction.RIGHT.y);
});

test('collision with boundary ends game', () => {
  const base = createInitialState(6);
  const state = {
    ...base,
    snake: [{ x: 5, y: 2 }, { x: 4, y: 2 }, { x: 3, y: 2 }],
    direction: Direction.RIGHT,
    pendingDirection: Direction.RIGHT,
    food: { x: 0, y: 0 },
  };

  const next = stepState(state, 0);
  assert.equal(next.isGameOver, true);
});

test('moving into previous tail cell is allowed when not growing', () => {
  const state = {
    gridSize: 6,
    snake: [
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    direction: Direction.LEFT,
    pendingDirection: Direction.LEFT,
    food: { x: 5, y: 5 },
    score: 0,
    isGameOver: false,
    isPaused: false,
  };

  const next = stepState(state, 0);

  assert.equal(next.isGameOver, false);
  assert.deepEqual(next.snake[0], { x: 1, y: 2 });
});

test('spawnFood picks only unoccupied cell', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  const food = spawnFood(snake, 2, 0.9);
  assert.deepEqual(food, { x: 1, y: 1 });
});
