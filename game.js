const grid = document.getElementById("grid");
let score = document.getElementById("score");
const modalEndLevel = document.getElementById("dialog-end-level");
const modalEndGame = document.getElementById("dialog-end-game");
const buttonStart = document.getElementById("start-game");
const healthElement = document.querySelectorAll(".health");
const modalLoseLife = document.getElementById("dialog-lose-life");
const buttonRestart = document.getElementById("button-restart");

const colums = 10;
const rows = 10;
const cellsClass = [];
const cellElements = [];
let playerPosition = 95;
let showScore = 0;
let health = 3;

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
        healthElement.forEach((i) => {
          i.textContent = health;
        });
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
// startGame(1000);
displayScore();

function startGame(speed) {
  modalEndGame.close();
  modalEndLevel.close();
  modalLoseLife.close();
  setInterval(() => {
    createEnemies(1);
    displayGrid();
    endLevel();
  }, speed);
}

//function to understand the key that are pressed and act depending on the
//key pressed
window.addEventListener("keydown", (event) => {
  // if (event.key == '39')
  // { playerPosition++;
  //   displayPlayer(playerPosition);
  // } else if (event.key == '37'){
  //     playerPosition--;
  //     displayPlayer(playerPosition);
  // } else {
  //     return;
  // }

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

// to get a random score between 6 and 10
function getRandomArbitrary() {
  return Math.floor(Math.random() * (11 - 6) + 6);
}

//add the random score calculated up to the score and display it every X seconds
function displayScore() {
  setInterval(() => {
    showScore += getRandomArbitrary();
    score.textContent = showScore;
  }, 10000);
}

//allow us to show a dialog message to say the level is finished after hitting
//a certain score
function endLevel() {
  if (showScore > 100) {
    modalEndLevel.showModal();
    playerPosition = 95;
  }
}

//show dialog message saying you lose the game
function endGame() {
  modalEndGame.showModal();
}

function loseHealth() {
  modalLoseLife.showModal();
  buttonRestart.addEventListener("click", () => startGame(1000), {
    once: true,
  });
}

buttonStart.addEventListener("click", () => startGame(1000), { once: true });

// function displayEnemies(){
//     setInterval(() => {
//         const badCellDisplay = document.querySelectorAll('.bad')
//     if(badCellDisplay.classList.contain('bad')){
//         cellElements.unshift(1);
//     }
//         }
// }, "500")
// }

//console.log(cellElements[playerPosition].classList);
