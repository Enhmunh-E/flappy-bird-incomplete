let board,
  boardWidth = 360,
  boardHeight = 640;
let context;

// bird

let birdWidth = 34,
  birdHeight = 24;
let birdX = boardWidth / 8,
  birdY = boardHeight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

// pipes

let pipeArray = [];
let pipeWidth = 65,
  pipeHeight = 512;
let pipeX = boardWidth,
  pipeY = 0;

let topPipeImg, bottomPipeImg;

// physics

let velocityX = -2; // pipes moving speed
let velocityY = 0; //bird jump speed
let gravity = 0;

let gameOver = true;

let score = 0;

window.onload = () => {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  birdImg = new Image();
  birdImg.src = "./assets/flappybird.png";

  birdImg.onload = () => {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./assets/toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./assets/bottompipe.png";

  requestAnimationFrame(update);

  document.addEventListener("keydown", moveBird);
};

let interval = null;

const startGame = () => {
  document.getElementById("play").style.display = "none";
  gravity = 0.2;
  bird.y = birdY;
  pipeArray = [];
  score = 0;
  gameOver = false;
  interval = setInterval(placePipes, 1500); // every 1.5 second
};

const endGame = () => {
  document.getElementById("play").style.display = "block";
  gameOver = true;
  velocityY = 0;
  clearInterval(interval);
};

const update = () => {
  requestAnimationFrame(update);
  if (gameOver) return;
  context.clearRect(0, 0, board.width, board.height);

  // bird;
  velocityY += gravity;
  bird.y = Math.max(bird.y + velocityY, 0);
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    endGame();
  }

  // pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }
    // Task Number 4 Make game end if the bird collides with pipe
  }

  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
  }

  context.fillStyle = "white";
  context.font = "45px VT323";
  context.fillText(score, 10, 45);

  if (gameOver) {
    context.fillText("Game Over", 10, 90);
  }
};

const placePipes = () => {
  if (gameOver) return;

  let randomPipeY = pipeY - pipeHeight / 4 - (Math.random() * pipeHeight) / 2;
  let openingSpace = boardHeight / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);
  pipeArray.push(bottomPipe);
};

const moveBird = (e) => {
  if (gameOver) return;
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX")
    velocityY = -6;
};

const detectCollistion = (a, b) => {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
};
