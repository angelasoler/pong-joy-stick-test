"use strict";
// import { io } from "socket.io-client";
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
console.log('Canvas e contexto:', canvas, ctx);
if (!ctx) {
    console.error('Erro: Não foi possível obter o contexto 2D do canvas.');
}
else {
    console.log('Contexto 2D obtido com sucesso:', ctx);
}
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
const io = require('socket.io-client');
const socket = io('http://localhost:5000');
socket.on('joystick_move', (data) => {
    // Assumindo que o servidor está enviando um objeto JSON
    const joystickY = data.y;
    // Mapeie o valor de Y do joystick para a posição da raquete
    const newPaddleY = joystickY / 1023 * (canvas.height - paddleHeight);
    console.log("Posição da raquete:", newPaddleY);
    // Atualizar a posição da raquete
    paddleY = newPaddleY;
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
function keyDownHandler(e) {
    if (e.key == 'Up' || e.key == 'ArrowUp') {
        upPressed = true;
    }
    else if (e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.key == 'Up' || e.key == 'ArrowUp') {
        upPressed = false;
    }
    else if (e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = false;
    }
}
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
// Função de atualização do jogo
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawBall();
    // Movimentar a raquete
    if (upPressed && paddleY > 0) {
        paddleY -= 5;
    }
    else if (downPressed && paddleY < canvas.height - paddleHeight) {
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
