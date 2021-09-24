"use strict";

const closeBtn = document.getElementById("close");
const startBtn = document.getElementById("start");
const instructions = document.querySelector(".instructions");
const help = document.getElementById("help");
const container = document.querySelector(".container");

const diceRoll = (sides) => Math.ceil(Math.random() * sides);

const diceRolls = {
  player1: [],
  player2: [],
  player3: [],
  player4: [],
};

const rollDice = function (container) {
  diceRolls["player" + container] = [];
  for (let i = 0; i < 5; i++) {
    const diceContainer = document.querySelector(`.diceContainer${container}`);
    const roll = diceRoll(6);
    diceRolls["player" + container].push(roll);
    let diceCup = "";
    if (container === 1) {
      diceCup = `<img src="/dice-cup.png" alt="upside down dice cup" id="playerDiceCup" class="diceCup"/>`;
    } else {
      diceCup = `<img src="/dice-cup.png" alt="upside down dice cup" class="diceCup"/>`;
    }
    diceContainer.innerHTML = diceCup;
  }
  diceRolls["player" + container].forEach((value) => {
    const diceContainer = document.querySelector(`.diceContainer${container}`);
    const diceRoll = value;
    let dice = "";
    container === 1
      ? (dice = `<img src="/dice-${diceRoll}.jpg" alt="dice on face ${diceRoll}" class="diceImg userDice" />`)
      : (dice = `<img src="/dice-${diceRoll}.jpg" alt="dice on face ${diceRoll}" class="diceImg" />`);
    diceContainer.insertAdjacentHTML("afterBegin", dice);
  });
};

const startState = function () {
  for (let i = 1; i < 5; i++) {
    rollDice(i);
  }
};

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  instructions.classList.add("hidden");
  container.classList.remove("hidden");
});

startBtn.addEventListener("click", function (e) {
  e.preventDefault();
  startState();
  closeBtn.style.display = "flex";
  instructions.classList.add("hidden");
  startBtn.style.display = "none";
  container.classList.remove("hidden");
  const playerDiceCup = document.getElementById("playerDiceCup");
  const userDice = document.querySelectorAll(".userDice");
  playerDiceCup.addEventListener("click", function () {
    playerDiceCup.classList.toggle("transformDiceCup");
    userDice.forEach((value) => {
      value.classList.toggle("fadeIn");
    });
  });
});

help.addEventListener("click", function (e) {
  e.preventDefault();
  instructions.classList.remove("hidden");
  container.classList.add("hidden");
});
