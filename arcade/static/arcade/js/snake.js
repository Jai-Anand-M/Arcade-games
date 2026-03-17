const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const grid = 20;
let count = 0;

let snake = {
  x: 160,
  y: 160,
  dx: grid,
  dy: 0,
  cells: [],
  maxCells: 4
};

let apple = {
  x: 320,
  y: 320
};

// get random whole numbers in a specific range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// game loop
function loop() {
  requestAnimationFrame(loop);

  if (++count < 4) {
    return;
  }

  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  ctx.fillStyle = '#ff107a'; // Neon Pink
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ff107a';
  ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // draw snake
  ctx.fillStyle = '#39ff14'; // Neon Green
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#39ff14';

  snake.cells.forEach(function(cell, index) {
    // drawing 1 px smaller than the grid creates a grid effect
    ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);  

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score += 10;

      // canvas is 800x600 which is 40x30 grids 
      apple.x = getRandomInt(0, 40) * grid;
      apple.y = getRandomInt(0, 30) * grid;
    }

    // check collision with all cells after this one
    for (var i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        score = 0;
        apple.x = getRandomInt(0, 40) * grid;
        apple.y = getRandomInt(0, 30) * grid;
      }
    }
  });
  
  ctx.shadowBlur = 0; // reset for normal drawing
  
  // Draw Score
  ctx.fillStyle = '#c5c6c7';
  ctx.font = '16px "Press Start 2P"';
  // Increase coordinates down and fully clear the left outline
  ctx.fillText('SCORE: ' + score, 80, 40);
}

let score = 0;

// Draw text before game starts showing loading/init state if needed
ctx.fillStyle = '#c5c6c7';
ctx.font = '16px "Press Start 2P"';
ctx.textAlign = 'center';
ctx.fillText('Press ARROW KEYS to Start', canvas.width/2, canvas.height/2);


document.addEventListener('keydown', function(e) {
  // Prevent default scrolling for arrow keys
  if([37, 38, 39, 40].indexOf(e.which) > -1) {
      e.preventDefault();
  }
  
  // left arrow key
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// Start loop
requestAnimationFrame(loop);
