"use strict";
const collectPlayers = function () {
  const playerArr = [];
  for (let i = 1; i < 5; i++) {
    playerArr.push(document.querySelector(`.player${i} h3`));
  }
  return playerArr;
};

const closeBtn = document.getElementById("close");
const startBtn = document.getElementById("start");
const instructions = document.querySelector(".instructions");
const help = document.getElementById("help");
const container = document.querySelector(".container");
const bidBtn = document.getElementById("bid");
const liarBtn = document.getElementById("liar");
const diceNumberInput = document.getElementById("numberOfDice");
const diceFaceInput = document.getElementById("diceFace");
const currentBidText = document.getElementById("currentBidText");
const currentBidContainer = document.querySelector(".currentBid");
const playerDiceContainer = document.querySelector(".diceContainer1");
const playerTags = collectPlayers();

/*contains the face and the ammount of the current bid in an object*/
let currentBid = {};
let turn = 1;

const diceRoll = (sides) => Math.ceil(Math.random() * sides);

const diceRolls = {
  player1: [],
  player2: [],
  player3: [],
  player4: [],
};

const rollDice = function (container) {
  diceRolls["player" + container] = [];
  const diceContainer = document.querySelector(`.diceContainer${container}`);
  for (let i = 0; i < 5; i++) {
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
    const diceRoll = value;
    let dice = "";
    container === 1
      ? (dice = `<img src="/dice-${diceRoll}.jpg" alt="dice on face ${diceRoll}" class="diceImg userDice" />`)
      : (dice = `<img src="/dice-${diceRoll}.jpg" alt="dice on face ${diceRoll}" class="diceImg" />`);
    diceContainer.insertAdjacentHTML("afterBegin", dice);
  });
};

const diceRollsAll = function (obj) {
  let allDice = [];
  for (let player in obj) {
    allDice.push(obj[player]);
  }
  return allDice.flat().reduce((tally, diceValue) => {
    tally[diceValue] = (tally[diceValue] || 0) + 1;
    return tally;
  }, {});
};

const computerTurns = function () {
  playerTags.forEach((value) => {
    value.classList.remove("activePlayer");
  });
  if (turn != 4) {
    playerTags[turn].classList.add("activePlayer");
  } else {
    playerTags[0].classList.add("activePlayer");
  }
  turn++;
  if (turn > 4) {
    clearInterval(computerLogic);
    turn = 1;
  }
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
  diceRolls.allDice = diceRollsAll(diceRolls);
});

help.addEventListener("click", function (e) {
  e.preventDefault();
  instructions.classList.remove("hidden");
  container.classList.add("hidden");
});

bidBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const face = +diceFaceInput.value;
  const amount = +diceNumberInput.value;
  diceFaceInput.value = "";
  diceNumberInput.value = "";
  if (face < 1 || face > 6) {
    alert("Type a dice value between 1 and 6");
  } else {
    currentBid.face = face;
    currentBid.amount = amount;
    currentBidText.innerText = `Current Bid
    Amount:  ${amount}
    Die Face:  ${face}`;
    currentBidContainer.style.opacity = 1;
    diceFaceInput.blur();
    let computerLogic = setInterval(computerTurns, 5000);
  }
});

playerDiceContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const userDice = document.querySelectorAll(".userDice");
  if (e.target.classList.contains("diceCup")) {
    e.target.classList.toggle("transformDiceCup");
    userDice.forEach((value) => {
      value.classList.toggle("fadeIn");
    });
  }
});
