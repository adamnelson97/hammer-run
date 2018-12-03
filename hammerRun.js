'use strict';
const canvas = document.getElementById("gameArea");
const ctx = canvas.getContext("2d");

let speed;
let coinDrop;
let hammerTime;
let spawnRate;
let hammerSpawnRate;

let stopFlag = true;

const laneWidth = canvas.width / 5;

const player = {
  width: laneWidth / 2,
  height: laneWidth / 2,
  lives: 3,
  lane: 2,
  yPos: 3 * laneWidth,
  hasHammer: false,
  coins: 0,
  hammerTimeout: null,
  draw: function() {
    // legs
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo((this.lane + 0.5) * laneWidth - (this.width / 4), this.yPos + this.height);
    ctx.lineTo((this.lane + 0.5) * laneWidth, this.yPos + this.height * 0.7);
    ctx.moveTo((this.lane + 0.5) * laneWidth + (this.width / 4), this.yPos + this.height);
    ctx.lineTo((this.lane + 0.5) * laneWidth, this.yPos + this.height * 0.7);
    // body
    ctx.lineTo((this.lane + 0.5) * laneWidth, this.yPos + this.height * 0.4);
    // arms
    ctx.moveTo((this.lane + 0.5) * laneWidth - (this.width / 2), this.yPos + this.height * 0.5);
    ctx.lineTo((this.lane + 0.5) * laneWidth + (this.width / 2), this.yPos + this.height * 0.5);
    ctx.stroke();
    // head
    ctx.beginPath();
    ctx.arc((this.lane + 0.5) * laneWidth, this.yPos + this.height * 0.2, this.height * 0.2, 0, 2 * Math.PI, true);
    ctx.stroke();

    // hammer?
    if (player.hasHammer) {
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo((this.lane + 0.5) * laneWidth + (this.width / 2), this.yPos + this.height * 0.7);
      ctx.lineTo((this.lane + 0.5) * laneWidth + (this.width / 2), this.yPos + this.height * 0.3);
      ctx.moveTo((this.lane + 0.5) * laneWidth + (this.width / 2) - 7, this.yPos + this.height * 0.3);
      ctx.lineTo((this.lane + 0.5) * laneWidth + (this.width / 2) + 7, this.yPos + this.height * 0.3);
      ctx.stroke();
	  
	  // cape
	  ctx.fillStyle = "purple";
	  ctx.fillRect((this.lane + 0.125) * laneWidth + (this.width / 2), this.yPos + this.height * 0.4, this.width * 0.5, this.height * 0.5);
	
	  //helmet
	  ctx.fillStyle = "#ffcc33";
	  ctx.fillRect((this.lane + 0.15) * laneWidth + (this.width / 2), this.yPos, this.width * 0.4, this.height * 0.15);
	  ctx.fillStyle = "#ffcc33";
	  ctx.fillRect((this.lane + 0.15) * laneWidth + (this.width / 2), this.yPos - this.height * 0.15, this.width * 0.1, this.height * 0.25);
	  ctx.fillStyle = "#ffcc33";
	  ctx.fillRect((this.lane + 0.3) * laneWidth + (this.width / 2), this.yPos - this.height * 0.15, this.width * 0.1, this.height * 0.25);
    }
  },
  handleKey: function(e) {
    switch (e.keyCode) {
      case 37: // left
        if (this.lane > 0) this.lane--;
        break;
      case 39: // right
        if (this.lane < 4) this.lane++;
        break;
    }
  }
};

function drawLives() {
  const fill = 'black';
  const height = 15;
  const width = 15;
  const margin = 5;
  ctx.fillStyle = "black";
  for (let i = 0; i < player.lives; i++) {
    ctx.fillRect((width + margin) * i + margin, margin, width, height);
  }
}

class Hammer {
  constructor() {
    this.lane = Math.floor(Math.random() * 5);
    this.height = laneWidth / 2;
    this.width = laneWidth / 2;
    this.yPos = 0 - this.height;
  }

  draw() {
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo((this.lane + 0.5) * laneWidth, this.yPos + this.height);
    ctx.lineTo((this.lane + 0.5) * laneWidth, this.yPos);
    ctx.moveTo((this.lane + 0.5) * laneWidth - (this.width / 2), this.yPos);
    ctx.lineTo((this.lane + 0.5) * laneWidth + (this.width / 2), this.yPos);
    ctx.stroke();
  }
}

let hammers = [];

class Enemy {
  constructor() {
    this.lane = Math.floor(Math.random() * 5);
    this.height = laneWidth / 2;
    this.width = laneWidth / 2;
    this.yPos = 0 - this.height;
  }

  draw() {
    ctx.strokeStyle = 'purple';
    ctx.lineWidth = 5;
    // big face
    ctx.beginPath();
    ctx.arc((this.lane + 0.5) * laneWidth, this.yPos + this.height / 2, this.height / 2, 0, 2 * Math.PI, true);
    ctx.stroke();
    // eyes
    ctx.beginPath();
    ctx.arc((this.lane + 0.5) * laneWidth - (this.width * 0.2), this.yPos + this.height * 0.3, this.height / 20, 0, 2 * Math.PI, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc((this.lane + 0.5) * laneWidth + (this.width * 0.2), this.yPos + this.height * 0.3, this.height / 20, 0, 2 * Math.PI, true);
    ctx.stroke();
    // mouth (dependent on hammer)
    if (player.hasHammer) {
      ctx.beginPath();
      ctx.arc((this.lane + 0.5) * laneWidth, this.yPos + this.height * 0.6, this.height / 5, 0, 2 * Math.PI, true);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo((this.lane + 0.5) * laneWidth - (this.width * 0.2), this.yPos + this.height * 0.6);
      ctx.lineTo((this.lane + 0.5) * laneWidth + (this.width * 0.2), this.yPos + this.height * 0.6);
      ctx.stroke();
    }
  }
}

let enemies = [];

function drawCoins() {
  ctx.font = "bold 12px Arial";
  ctx.fillText(`Coins collected: ${player.coins}`, canvas.width - 150, 20);
}

function drawGameArea() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //Draw background
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, canvas.width / 5, canvas.height);
  ctx.fillStyle = "orange";
  ctx.fillRect(canvas.width * 0.2, 0, canvas.width / 5, canvas.height);
  ctx.fillStyle = "yellow";
  ctx.fillRect(canvas.width * 0.4, 0, canvas.width / 5, canvas.height);
  ctx.fillStyle = "#00ff66";
  ctx.fillRect(canvas.width * 0.6, 0, canvas.width / 5, canvas.height);
  ctx.fillStyle = "#00ccff";
  ctx.fillRect(canvas.width * 0.8, 0, canvas.width / 5, canvas.height);

  //Draw lane dividers
  ctx.fillStyle = "white";
  ctx.fillRect((canvas.width / 5) - 2.5, 0, 5, canvas.height);
  ctx.fillRect(2 * (canvas.width / 5) - 2.5, 0, 5, canvas.height);
  ctx.fillRect(3 * (canvas.width / 5) - 2.5, 0, 5, canvas.height);
  ctx.fillRect(4 * (canvas.width / 5) - 2.5, 0, 5, canvas.height);

  player.draw();
  drawLives();
  drawCoins();
  enemies.forEach(e => e.draw());
  hammers.forEach(h => h.draw());
}

function updatePositions() {
  enemies.forEach(e => e.yPos += speed);
  enemies = enemies.filter(e => e.yPos < canvas.height);

  hammers.forEach(h => h.yPos += speed);
  hammers = hammers.filter(h => h.yPos < canvas.height);
  
  if (player.hasHammer) {
	  $('body').css('background-image', 'url(images/lightning.jpg)');
  } else {
	    $('body').css('background-image', 'url(images/thor-hammer-pic.jpg!d)');
  }
}

function spawnEnemies() {
  if (Math.random() < spawnRate) {
    enemies.push(new Enemy());
  }
}

function spawnHammers() {
  if (Math.random() < hammerSpawnRate) {
    hammers.push(new Hammer());
  }
}

function handleEnemyCollision(enemy) {
  if (player.hasHammer) {
    player.coins += coinDrop;
  } else {
    player.lives--;
    if (player.lives == 0) stopGame();
  }
  enemies = enemies.filter(e => e !== enemy); // get rid of collided enemy
}

function handleHammerCollision(hammer) {
  player.hasHammer = true;
  if (player.hammerTimeout) {
    window.clearTimeout(player.hammerTimeout);
  }
  player.hammerTimeout = window.setTimeout(() => player.hasHammer = false, hammerTime * 1000);
  hammers = hammers.filter(h => h !== hammer);
}

function detectCollision() {
  enemies
    .filter(e => e.lane === player.lane)
    .filter(e => !((e.yPos + e.height) < player.yPos)) // filter out where enemy is completely above hero
    .filter(e => !((player.yPos + player.height) < e.yPos)) // filter where hero is completely above enemy
    .forEach(handleEnemyCollision);

  hammers
    .filter(h => h.lane === player.lane)
    .filter(h => !((h.yPos + h.height) < player.yPos)) // filter out where enemy is completely above hero
    .filter(h => !((player.yPos + player.height) < h.yPos)) // filter where hero is completely above enemy
    .forEach(handleHammerCollision);
}

function runGame() {
  if (stopFlag) return;
  updatePositions();
  spawnEnemies();
  spawnHammers();
  drawGameArea();
  detectCollision();
  window.requestAnimationFrame(runGame);
}

function startGame() {
  if (!stopFlag) return;
  stopFlag = false;
  player.lane = 2;
  speed = 2;
  coinDrop = 10;
  hammerTime = 30;
  spawnRate = 0.005;
  hammerSpawnRate = .002;
  player.lives = 3;
  player.coins = 0;
  hammers = [];
  enemies = [];
  window.requestAnimationFrame(runGame);
  $('body').css('background-image', 'url(images/thor-hammer-pic.jpg!d)');
}

function stopGame() {
  stopFlag = true;
  // API call
  highscore(player.coins);
  $('body').css('background-image', 'url(images/valhalla.jpg)');
  $('body').css('background-size', 'cover');
}

function levelUp() {
  speed += 0.5;
  spawnRate += .005;
  coinDrop += 5;
  hammerTime -= hammerTime / 10;
}

window.setInterval(levelUp, 5000); // change game parameters every 5 seconds

window.addEventListener("keydown", player.handleKey.bind(player), false);

// API call
window.update_scores();
