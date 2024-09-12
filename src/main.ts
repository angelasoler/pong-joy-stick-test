const canvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

// Configurações do jogo
const paddleHeight = 100;
const paddleWidth = 10;
const ballRadius = 10;
let upPressed = false;
let downPressed = false;

// Posições iniciais
let paddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballDX = 2;
let ballDY = -2;

const socket = new WebSocket('ws://localhost:5000');

// Ouvir os eventos do WebSocket
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.direction === 'up') {
    if (paddleY > 0) {
      paddleY -= 5;
    }
  } else if (data.direction === 'down') {
    if (paddleY < canvas.height - paddleHeight) {
      paddleY += 5;
    }
  }
});

// Função para desenhar a raquete
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(0, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

// Função para desenhar a bola
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

// Função para detectar teclas pressionadas
function keyDownHandler(e: KeyboardEvent) {
  if (e.key == 'Up' || e.key == 'ArrowUp') {
    upPressed = true;
  } else if (e.key == 'Down' || e.key == 'ArrowDown') {
    downPressed = true;
  }
}

function keyUpHandler(e: KeyboardEvent) {
  if (e.key == 'Up' || e.key == 'ArrowUp') {
    upPressed = false;
  } else if (e.key == 'Down' || e.key == 'ArrowDown') {
    downPressed = false;
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Função de atualização do jogo
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();

  // Movimentar a raquete
  if (upPressed && paddleY > 0) {
    paddleY -= 5;
  } else if (downPressed && paddleY < canvas.height - paddleHeight) {
    paddleY += 5;
  }

  // Movimento da bola
  ballX += ballDX;
  ballY += ballDY;

  // Detectar colisões com a parede superior e inferior
  if (ballY + ballDY < ballRadius || ballY + ballDY > canvas.height - ballRadius) {
    ballDY = -ballDY;
  }

  // Detectar colisão com a raquete
  if (ballX + ballDX < paddleWidth && ballY > paddleY && ballY < paddleY + paddleHeight) {
    ballDX = -ballDX;
  }

  // Resetar a bola se sair da tela
  if (ballX + ballDX > canvas.width || ballX + ballDX < 0) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballDX = -ballDX;
  }

  requestAnimationFrame(updateGame);
}

updateGame();

