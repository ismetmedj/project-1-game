const grid = document.getElementById("grid");
let score = document.getElementById("score");
const modalEndLevel = document.getElementById("dialog-end-level");
const modalEndGame = document.getElementById("dialog-end-game");
const buttonStart = document.getElementById("start-game");
const healthElement = document.querySelector(".health");
// const modalLoseLife = document.getElementById("dialog-lose-life");
const buttonRestart = document.getElementById("button-restart");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const finalScore = document.querySelectorAll(".final-score");
const resetGame = document.getElementById("button-reset");
const nextLevel = document.querySelector(".button-end-level");
const levelNumber = document.getElementById("level-number");
const nextLevelNumber = document.getElementById("next-level-number");
const levelMoment = document.getElementById("level-moment");
const playMode = document.getElementById("play-mode-audio");
const endLevelAudio = document.getElementById("end-level-audio");
const endGameAudio = document.getElementById("end-game-audio");
const loseLifeAudio = document.getElementById("lose-life-audio");
const bombAudio = document.getElementById("bomb-audio");
const mute = document.getElementById("mute")

const colums = 10;
const rows = 10;
const cellsClass = [];
const cellElements = [];
let playerPosition = 95;
let showScore = 0; //
let aimScore = 0;
let goalScore = 75;
let health = 3;
let intervalId = null;
let timerInterval = null;
let timeOutId = null;
let speed = 500;
let numberOfEnemies = 1;
let pause = false;
let counterSeconds = 0;
let counterMinutes = 0;
let debug = Date.now();
let nombre = 1;

//Set the grid
function createGrid() {
  for (let i = 0; i < colums * rows; i++) {
    createCell();
  }
}

//Set the cells & the class array for the cells
function createCell() {
  const div = document.createElement("div");
  div.classList.add("cell");
  grid.append(div);
  cellElements.push(div);
  cellsClass.push("");
}

//Display the player on the grid
function displayPlayer() {
  cellElements[playerPosition].classList.add("player");
}

//Hide the player on the grid
function hidePlayer() {
  cellElements[playerPosition].classList.remove("player");
}

//Display the enemies on the grid
function displayGrid() {
  displayPlayer();
  cellsClass.forEach((cell, i) => {
    //Allow us to do the collision between the player and an obstacle
    if (i === playerPosition) {
      if (cell === "bad" && cell !== "life") {
        hidePlayer();
        health--;
        loseLifeMusic();
        showHealth();

        // for (let i = 0; i < health ; i++){

        // healthElement.innerHTML = ""
        // for (boucle sur health) {
        //   append coeur
        // }
        // healthElement.textContent = health;
      }
      if (cell === "life") {
        health++;
        showHealth();
        // console.log(health);
        // healthElement.textContent = health;
      }
      if (nombre >= 3 && cell === "bomb") {
        cellsClass.splice(0, cellsClass.length);
        createGrid();
        bombMusic();
        showScore += 50;
      }
      if (health <= 0) {
        return endGame();
      }

      //console.log("Collision !");
      return loseHealth();
    }
    cellElements[i].className = `cell ${cell}`;
  });
}

//Create enemies on the top line
function createEnemies(number) {
  //   const copy = [...cellElements];
  //   copy.splice(playerPosition, 1);
  //   copy.splice(90, 10);
  //   for (let i = 0; i < number; i++) {
  //     const randomIndex = Math.floor(Math.random() * copy.length);
  //     const randomCell = copy[randomIndex];
  //     randomCell.classList.add("bad");
  //     copy.splice(randomIndex, 1);
  //  }

  //create an new array of 10, then the splice remove the 10 last element
  //of the array cells & then we add the new array of 10 at the beginning
  //of the cells array, with new enemies inside so we got every new line
  //some enemies and allow us to made the enemies go down
  const newLineEnemies = new Array(10).fill("");
  let randomNumber = Math.floor(Math.random() * newLineEnemies.length);
  if (health < 2 && randomNumber > 8) {
    const randomLife = Math.floor(Math.random() * newLineEnemies.length);
    newLineEnemies[randomLife] = "life";
  } else if (nombre >= 3 && randomNumber >= 9) {
    const randomBomb = Math.floor(Math.random() * newLineEnemies.length);
    newLineEnemies[randomBomb] = "bomb";
  }
  for (let i = 0; i < number; i++) {
    const randomIndex = Math.floor(Math.random() * newLineEnemies.length);

    newLineEnemies[randomIndex] = "bad";
  }
  cellsClass.splice(-10);
  cellsClass.unshift(...newLineEnemies);
}
createGrid();
//displayScore();

function showHealth() {
  healthElement.innerHTML = null;

  for (let i = 0; i < health; i++) {
    const span = document.createElement("span");
    span.classList.add("heart");
    healthElement.append(span);
  }
}

function startGame(speed) {
  // console.log("from start game");
  clearInterval(intervalId);
  clearInterval(timerInterval);
  intervalId = null;
  showHealth();
  // score =0;
  modalEndGame.close();
  modalEndLevel.close();
  // modalLoseLife.close();
  displayTime();
  levelMoment.textContent = nombre;
  let i = 0;
  startMusic();

  intervalId = setInterval(() => {
    // console.log(Date.now() - debug);
    // debug = Date.now();
    // console.log("hellooooooo");
    // console.log(speed);
    createEnemies(numberOfEnemies);
    displayGrid();
    i += speed / 10;
    if (i > speed) {
      // console.log(i);
      displayScore();
    }
    endLevel();
  }, speed);
  // console.log(intervalId);
}

//function to understand the key that are pressed and act depending on the
//key pressed
window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "ArrowLeft":
      //allow us to keep the player inside the grid (on the left side)
      if (playerPosition % 10 === 0) {
        return;
      }
      hidePlayer();
      playerPosition--;
      displayPlayer(playerPosition);
      break;

    case "ArrowRight":
      //allow us to keep the player inside the grid (on the right side)
      if ((playerPosition + 1) % 10 === 0) {
        return;
      }
      hidePlayer();
      playerPosition++;
      displayPlayer(playerPosition);
      break;
  }
});

// to get a random score between 3 and 6
function getRandomArbitrary() {
  return Math.floor(Math.random() * (6 - 3) + 3);
}

//add the random score calculated up to the score and display it every X seconds
function displayScore() {
  // timeOutId =setTimeout(() => {
  // console.log(pause);
  if (!pause) {
    showScore += getRandomArbitrary();
  }

  aimScore = showScore;
  score.textContent = showScore;
  // }, 10000);
}

function displayFinalScore() {
  finalScore.forEach((el) => (el.textContent = showScore));
}

//allow us to show a dialog message to say the level is finished after hitting
//a certain score
function endLevel() {
  // console.log(speed);

  if (health <= 0) {
    endGame();
  } else {
    if (aimScore > goalScore) {
      pause = true;
      displayLevelNumber(nombre);
      stopPlayMusic();
      endLevelMusic();
      modalEndLevel.showModal();
      // playerPosition = 95;
      clearInterval(intervalId);
      // clearInterval(timerInterval);
      cellsClass.splice(0, cellsClass.length);
      displayFinalScore();
      goalScore *= 3;
      speed -= 50;
      // console.log(speed);
      numberOfEnemies++;
      nombre++;
    }
  }
}
nextLevel.addEventListener("click", () => {
  createGrid();
  aimScore = 0;
  displayGrid();
  pause = false;
  stopEndLevelMusic();
  startGame(speed);
});

//show dialog message saying you lose the game
function endGame() {
  stopPlayMusic();
  endGameMusic();
  modalEndGame.showModal();
  clearInterval(intervalId);
  clearInterval(timerInterval);
  cellsClass.splice(0, cellsClass.length);
  displayFinalScore();

  // clearTimeout(timeOutId);
}
resetGame.addEventListener("click", () => {
  stopEndGameMusic();
  showScore = 0;
  score.textContent = showScore;
  health = 3;
  healthElement.textContent = health;
  counterSeconds = 0;
  counterMinutes = 0;
  minutes.textContent = "00";
  seconds.textContent = "00";
  aimScore = 0;
  goalScore = 75;
  speed = 500;
  numberOfEnemies = 1;
  nombre = 1;
  createGrid();
  // displayScore()
  displayGrid();
  startGame(speed);
});

function loseHealth() {
  // modalLoseLife.showModal();
  // clearInterval(intervalId);
  // clearInterval(timerInterval);
  // buttonRestart.addEventListener("click", () => startGame(1000), {
  // once: true,
  // });
}

function displayTime() {
  timerInterval = setInterval(() => {
    if (!pause) {
      counterSeconds++;
    }

    if (counterSeconds > 59) {
      counterSeconds = 0;
      counterMinutes++;

      minutes.textContent = `0${counterMinutes}`;
    }

    if (counterSeconds < 10) {
      seconds.textContent = `0${counterSeconds}`;
    } else {
      seconds.textContent = counterSeconds;
    }
  }, 1000);
}

function displayLevelNumber(nombre) {
  levelNumber.textContent = nombre;
  nextLevelNumber.textContent = nombre + 1;
}

function startMusic() {
  // const audio = new Audio('./sounds/play-mode.mp3');
  // audio.addEventListener('canplaythrough', () => audio.play())
  playMode.playbackRate = 1.5;
  playMode.loop = true
  playMode.play();
}

function stopPlayMusic() {
  //  audio = new Audio('./sounds/play-mode.mp3');
  playMode.pause();
}

function endLevelMusic() {
  // var audio = new Audio('./sounds/end-level.wav');
  endLevelAudio.play();
}

function stopEndLevelMusic() {
  // var audio = new Audio('./sounds/end-level.wav');
  endLevelAudio.pause();
}

function endGameMusic() {
  // var audio = new Audio('./sounds/end-game.wav');
  endGameAudio.play();
}

function stopEndGameMusic() {
  // var audio = new Audio('./sounds/end-game.wav');
  endGameAudio.pause();
}

function loseLifeMusic() {
  // var audio = new Audio('./sounds/lose-life.wav');
  loseLifeAudio.play();
}

function endLoseLifeMusic() {
  // var audio = new Audio('./sounds/lose-life.wav');
  loseLifeAudio.pause();
}

function bombMusic() {
  // var audio = new Audio('./sounds/bomb.wav');
  bombAudio.play();
}

function stopBombMusic() {
  // var audio = new Audio('./sounds/bomb.wav');
  bombAudio.pause();
}

buttonStart.addEventListener("click", () => startGame(speed), { once: true });

mute.addEventListener("click", () => {
  stopPlayMusic();
  stopEndLevelMusic();
  stopEndGameMusic();
  endLoseLifeMusic();
  stopBombMusic();

});

// resetGame.addEventListener("click", () => {
//   createGrid();
//   // startGame(500);
// });


