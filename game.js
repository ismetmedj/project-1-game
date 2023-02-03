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
const mute = document.getElementById("mute");

const colums = 10;
const rows = 10;
const cellsClass = [];
const cellElements = [];
let playerPosition = 95;
let showScore = 0; //is the score we are displaying on the page
let aimScore = 0; //is a counter score so we know when we it the goalScore to get to the next level
let goalScore = 75; //is the score needed to reach to get to the next level
let health = 3;
let intervalId = null;
let timerInterval = null;
let timeOutId = null;
let speed = 500;
let numberOfEnemies = 1;
let pause = false; //boolean to help us stop the score and the time at the end of a level and start the new level with the score and time from the previous level
let counterSeconds = 0;
let counterMinutes = 0;
let debug = Date.now();
let nombre = 1; //a int to help us keep track of which level we are

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
    //Allow us to do the collision between the player and an obstacle/life or bomb
    if (i === playerPosition) {
      if (cell === "bad" && cell !== "life") {
        hidePlayer();
        health--;
        loseLifeMusic();
        showHealth();
      }

      if (cell === "life") {
        health++;
        showHealth();
      }
      //if nombre >=3 means if level 3 or more
      if (nombre >= 3 && cell === "bomb") {
        cellsClass.splice(0, cellsClass.length); //clear the grid from all obstacle
        createGrid();
        bombMusic();
        showScore += 50;
      }
      if (health <= 0) {
        return endGame();
      }

      //console.log("Collision !");
      return loseHealth(); //if i comment that line my player position hide and appear only when i move !!!!
    }
    cellElements[i].className = `cell ${cell}`;
  });
}

//Create enemies on the top line
function createEnemies(number) {
  //create an new array of 10, then the splice remove the 10 last element
  //of the array cells & then we add the new array of 10 at the beginning
  //of the cells array, with new enemies inside so we got every new line
  //some enemies and allow us to made the enemies go down
  const newLineEnemies = new Array(10).fill(""); //create an fill a new array of 10
  let randomNumber = Math.floor(Math.random() * newLineEnemies.length);
  if (health < 2 && randomNumber > 8) {
    //create life obstacle to get an extra life
    const randomLife = Math.floor(Math.random() * newLineEnemies.length);
    newLineEnemies[randomLife] = "life";
  } else if (nombre >= 3 && randomNumber >= 9) {
    //create bomb obstacle to clear the grid
    const randomBomb = Math.floor(Math.random() * newLineEnemies.length);
    newLineEnemies[randomBomb] = "bomb";
  }
  for (let i = 0; i < number; i++) {
    //create classic obstacle
    const randomIndex = Math.floor(Math.random() * newLineEnemies.length);

    newLineEnemies[randomIndex] = "bad";
  }
  cellsClass.splice(-10); //erase the last 10 element of the array cells
  cellsClass.unshift(...newLineEnemies); //add a new 10 element a the beginning of the array cells
}
createGrid();
//displayScore();

//function create the heart class to display the number of lives remaining to the player
function showHealth() {
  healthElement.innerHTML = null;

  for (let i = 0; i < health; i++) {
    const span = document.createElement("span");
    span.classList.add("heart");
    healthElement.append(span);
  }
}

//evrything is in the name ;)
function startGame(speed) {
  // console.log("from start game");
  clearInterval(intervalId); //interval de défilement des obstacle
  clearInterval(timerInterval); // interval de temps
  intervalId = null;
  showHealth();
  // score =0;
  modalEndGame.close();
  modalEndLevel.close();
  // modalLoseLife.close();
  displayTime();
  levelMoment.textContent = nombre; // affiche le niveau auquel on est
  let i = 0;
  startMusic();

  intervalId = setInterval(() => {
    createEnemies(numberOfEnemies);
    displayGrid();
    //allow us to set time to display the score once the first obstacle reach the baseline
    i += speed / 10;
    if (i > speed) {
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
  if (!pause) {
    showScore += getRandomArbitrary();
  }
  aimScore = showScore;
  score.textContent = showScore;
}

//
function displayFinalScore() {
  finalScore.forEach((el) => (el.textContent = showScore));
}

//allow us to show a dialog message to say the level is finished after hitting
//a certain score
function endLevel() {
  if (health <= 0) {
    endGame();
  } else {
    if (aimScore > goalScore) {
      pause = true;
      displayLevelNumber(nombre);
      stopPlayMusic();
      endLevelMusic();
      modalEndLevel.showModal();
      playerPosition = 95;
      clearInterval(intervalId);
      cellsClass.splice(0, cellsClass.length);
      displayFinalScore();
      goalScore *= 3;
      speed -= 50;
      numberOfEnemies++;
      nombre++;
    }
  }
}

//next level button and what happen when we clikc on it
nextLevel.addEventListener("click", () => {
  createGrid();
  aimScore = 0; // reset aimScore to 0 (it's our counter) so we can play until we reach goalScore
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
}

//next level button and what happen when we clikc on it
//stop endGameMusic, reset eveything and star a new game
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

//everything is in the title function
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

//everything is in the title function
function displayLevelNumber(nombre) {
  levelNumber.textContent = nombre;
  nextLevelNumber.textContent = nombre + 1;
}

// the 10 next function are the audio setting for the game, endgame, endlevel, loselife and bomb
function startMusic() {
  playMode.playbackRate = 1.5;
  playMode.loop = true;
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

//button to start a game and start it only once => once:true
buttonStart.addEventListener("click", () => startGame(speed), { once: true });

//mute button to shut down all music
mute.addEventListener("click", () => {
  stopPlayMusic();
  stopEndLevelMusic();
  stopEndGameMusic();
  endLoseLifeMusic();
  stopBombMusic();
});
