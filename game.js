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
const nextLevel = document.querySelector('.button-end-level');

const colums = 10;
const rows = 10;
const cellsClass = [];
const cellElements = [];
let playerPosition = 95;
let showScore = 0; // 
let aimScore = 0;
let goalScore = 50;
let health = 3;
let intervalId = null;
let timerInterval = null;
let timeOutId = null;
let speed = 500
let numberOfEnemies = 1
let pause = false
let counterSeconds = 0;
let counterMinutes = 0;

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
      if (cell === "bad") {
        hidePlayer();
        health--;
        healthElement.textContent = health;
        if (health <= 0) {
          return endGame();
        }

        //console.log("Collision !");
        return loseHealth();
      }
      return;
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
  for (let i = 0; i < number; i++) {
    const randomIndex = Math.floor(Math.random() * newLineEnemies.length);
    newLineEnemies[randomIndex] = "bad";
  }
  cellsClass.splice(-10);
  cellsClass.unshift(...newLineEnemies);
}

createGrid();
//displayScore();

function startGame(speed) {
  clearInterval(intervalId);
  clearInterval(timerInterval);

  // score =0;
  modalEndGame.close();
  modalEndLevel.close();
  // modalLoseLife.close();
  displayTime();

  let i = 0;

  intervalId = setInterval(() => {
    createEnemies(numberOfEnemies);
    displayGrid();
    i += speed / 10;
    if (i > speed) {
      // console.log(i);
      displayScore();
    }
    endLevel();
  }, speed);
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
 
  if(health <= 0){
    endGame();

  } else {
  if (aimScore > goalScore) {
    pause = true
    modalEndLevel.showModal();
    playerPosition = 95;
    // clearInterval(intervalId);
    // clearInterval(timerInterval);
    cellsClass.splice(0, cellsClass.length);
    displayFinalScore();
    goalScore *= 3;
    speed = speed/1.6;
    numberOfEnemies++;
    nextLevel.addEventListener("click", () => {
      createGrid();
      aimScore = 0;
      displayGrid();
      pause = false
      startGame(speed);

    
    })
  } 
}
}

//show dialog message saying you lose the game
function endGame() {
  modalEndGame.showModal();
  clearInterval(intervalId);
  clearInterval(timerInterval);
  cellsClass.splice(0, cellsClass.length);
  displayFinalScore();

  // clearTimeout(timeOutId);

  resetGame.addEventListener("click", () => {
    showScore = 0;
    score.textContent = showScore;
    health = 3;
    healthElement.textContent = health;
    counterSeconds = 0;
    counterMinutes = 0;
    minutes.textContent = '00'
    seconds.textContent = '00'
    aimScore = 0;
    goalScore = 50;
    speed = 1000
    numberOfEnemies = 1
    // displayScore()
    displayGrid();
    startGame(speed);
  });
}

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

buttonStart.addEventListener("click", () => startGame(speed), { once: true });

resetGame.addEventListener("click", () => {
  createGrid();
  // startGame(500);
});

