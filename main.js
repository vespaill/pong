var canvas;
var canvasContext;

var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var ballRadius = 10;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  };
}

function handleMouseClick() {
  if (showingWinScreen) {
    player1Score = player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  // Call move() and draw() 30 times per second.
  var framesPerSecond = 30;
  setInterval(function () {
    moveAll();
    drawAll();
  }, 1000 / framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);
  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;

  if (paddle2YCenter < ballY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > ballY + 35) {
    paddle2Y -= 6;
  }
}

/**
 * Resets the ball once a player has scored.
 */
function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX *= -1;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

/**
 * Make the ball move, and bounce off paddles and top and bottom of screen.
 */
function moveAll() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  var deltaY;
  // Ball touches left side.
  if (ballX <= ballRadius + PADDLE_THICKNESS) {
    // Ball touches player1's paddle.
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX *= -1;

      deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
      // Player 1 misses ball.
    } else {
      player2Score++; // Must be BEFORE ballReset().
      ballReset();
    }
  }
  // Ball touches ride side.
  if (ballX >= canvas.width - ballRadius - PADDLE_THICKNESS) {
    // ball touches player2's paddle.
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX *= -1;

      deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.35;
      // Player 2 misses ball.
    } else {
      player1Score++; // Must be BEFORE ballReset().
      ballReset();
    }
  }

  if (ballY <= ballRadius) {
    ballSpeedY *= -1;
  }
  if (ballY >= canvas.height - ballRadius) {
    ballSpeedY *= -1;
  }
}

/**
 * Draws a background, a ball, a net, and player rackets and scores.
 */
function drawAll() {
  // Draw background.
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  if (showingWinScreen) {
    canvasContext.fillStyle = 'white';
    // canvasContext.textAlign = "center";

    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText('You Won!', canvas.width / 2 - 100, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText('Computer Won..', canvas.width / 2 - 100, 200);
    }

    canvasContext.fillText('Click to play again', canvas.width / 2 - 100, 400);
    return;
  }

  // Draw  ball.
  colorCircle(ballX, ballY, ballRadius, 'white');

  // Draw left player paddle.
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

  // Draw right computer paddle.
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    'white'
  );

  drawNet();

  canvasContext.font = '30px Arial';
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

/**
 * Draws a rectangle of the given dimensions at the given coordinates and fills
 * it with the given drawColor.
 * @param {Number} leftX
 * @param {Number} topY
 * @param {Number} width
 * @param {Number} height
 * @param {String} drawColor
 */
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

/**
 * Draws a circle of the given radius and drawColor at the given centerX
 * and centerY.
 * @param {*} centerX
 * @param {*} centerY
 * @param {*} radius
 * @param {*} drawColor
 */
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

/**
 * Draws a dashed line in the middle of the game screen.
 */
function drawNet() {
  canvasContext.fillStyle = 'white';
  for (var i = -10; i < canvas.height + 10; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
  }
}
