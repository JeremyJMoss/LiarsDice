"use strict";
// const dice = `<img src="/dice-${roll}.jpg" alt="dice on face ${roll}" class="diceImg" />`;

const closeBtn = document.getElementById("close");
const startBtn = document.getElementById("start");
const instructions = document.querySelector(".instructions");
const diceCup = document.querySelector(".diceCup");
const help = document.getElementById("help");

const diceRoll = (sides) => Math.ceil(Math.random() * sides);

const diceRolls = {
  player1: [],
  player2: [],
  player3: [],
  player4: [],
};

const displayDice = function (container) {
  for (let i = 0; i < 5; i++) {
    const diceContainer = document.querySelector(`.diceContainer${container}`);
    const roll = diceRoll(6);
    diceRolls["player" + container].push(roll);
    const diceCup = `<img src="/dice-cup.png" alt="upside down dice cup" class="diceCup"/>`;
    diceContainer.innerHTML = diceCup;
  }
};

const startState = function () {
  displayDice(1);
  displayDice(2);
  displayDice(3);
  displayDice(4);
};

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  instructions.classList.add("hidden");
  help.classList.remove("hidden");
});

startBtn.addEventListener("click", function (e) {
  e.preventDefault();
  startState();
  closeBtn.style.display = "flex";
  instructions.classList.add("hidden");
  startBtn.style.display = "none";
  help.classList.remove("hidden");
});

help.addEventListener("click", function (e) {
  e.preventDefault();
  instructions.classList.remove("hidden");
  help.classList.add("hidden");
});
