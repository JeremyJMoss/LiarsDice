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
const gameInputs = document.querySelector(".gameInputs");
const thinkText = document.querySelector(".comThinking");
const winLoseMessage = document.querySelector(".winLoseMessage");
const continueBtn = document.getElementById("continue");
const amountContainer = document.querySelector(".diceAmountsContainer");

/*contains the face and the ammount of the current bid in an object*/
let currentBid = {
  face: 0,
  amount: 0,
};
let turn = 1;
let liar = false;
let activeDots;
let curPlayer = "player1";
let prevPlayer = "player4";
let computerLogic;
const randomInt = (range) => Math.ceil(Math.random() * range);

const playerDiceAmounts = {
  player1: 5,
  player2: 5,
  player3: 5,
  player4: 5,
};

const calcTotalDice = function () {
  let sum = 0;
  for (let value of Object.values(playerDiceAmounts)) {
    sum += value;
  }
  return sum;
};

const totalDice = calcTotalDice();

console.log(totalDice);

const diceRolls = {
  player1: [],
  player2: [],
  player3: [],
  player4: [],
};

const addDiceCups = function (container) {
  const diceContainer = document.querySelector(`.diceContainer${container}`);
  let diceCup = "";
  if (container === 1) {
    diceCup = `<img src="/dice-cup.png" alt="upside down dice cup" id="playerDiceCup" class="diceCup"/>`;
  } else {
    diceCup = `<img src="/dice-cup.png" alt="upside down dice cup" class="diceCup"/>`;
  }
  diceContainer.innerHTML = diceCup;
};

const rollDice = function (container, diceAmount) {
  diceRolls[`player${container}`] = [];
  const diceContainer = document.querySelector(`.diceContainer${container}`);
  for (let i = 0; i < diceAmount; i++) {
    const roll = randomInt(6);
    diceRolls["player" + container].push(roll);
  }
  diceRolls["player" + container].forEach((value) => {
    const diceRoll = value;
    let dice = "";
    container == 1
      ? (dice = `<img src="/dice-${diceRoll}.jpg" alt="dice on face ${diceRoll}" class="diceImg userDice" />`)
      : (dice = `<img src="/dice-${diceRoll}.jpg" alt="dice on face ${diceRoll}" class="diceImg" />`);
    diceContainer.insertAdjacentHTML("afterBegin", dice);
  });
};

const createDiceAmounts = function () {
  amountContainer.innerHTML = "";

  for (let [index, value] of Object.entries(playerDiceAmounts)) {
    let li = document.createElement("li");
    li.innerHTML = `${
      index.slice(0, 1).toUpperCase() +
      index.slice(1, index.length - 1) +
      " " +
      index.slice(-1)
    }: <span>${value}</span>`;
    amountContainer.appendChild(li);
  }
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

/*for when either the computer or the player calls liar*/
const callLiar = function () {
  liar = true;
  const message = winLoseMessage.querySelector("p");
  clearInterval(computerLogic);
  clearInterval(activeDots);
  thinkText.innerHTML = "";
  if (
    diceRolls.allDice[currentBid.face] + diceRolls.allDice["1"] <=
    currentBid.amount
  ) {
    playerDiceAmounts[prevPlayer] -= 1;
    console.log(curPlayer);
    if (curPlayer === "player1") {
      message.innerText = `You have won this round! Congratulations! The board will be reset with Player 4 having 1 less die and you starting the bids.`;
      curPlayer = curPlayer;
      prevPlayer = prevPlayer;
      turn = 1;
    } else {
      message.innerText = `${
        curPlayer.charAt(0).toUpperCase() +
        curPlayer.slice(1, 6) +
        " " +
        curPlayer.slice(-1)
      } has won this round! The board will be reset with ${
        prevPlayer.charAt(0).toUpperCase() +
        prevPlayer.slice(1, 6) +
        " " +
        prevPlayer.slice(-1)
      } having 1 less die and ${
        curPlayer.charAt(0).toUpperCase() +
        curPlayer.slice(1, 6) +
        " " +
        curPlayer.slice(-1)
      } starting the bids.`;
      turn -= 1;
    }
  } else {
    playerDiceAmounts[curPlayer] -= 1;
    if (curPlayer === "player1") {
      message.innerText = `You have guessed wrong! The board will reset with your dice being reduced by 1. And starting player set to Player 4.`;
      curPlayer = prevPlayer;
      prevPlayer =
        prevPlayer.slice(0, 6) + prevPlayer.slice(-1) - 1 === 0
          ? 4
          : prevPlayer.slice(-1) - 1;
      turn = Object.keys(playerDiceAmounts).length;
    } else {
      message.innerText = `${
        curPlayer.charAt(0).toUpperCase() +
        curPlayer.slice(1, 6) +
        " " +
        curPlayer.slice(-1)
      } called Liar, They guessed wrong so ${
        curPlayer.charAt(0).toUpperCase() +
        curPlayer.slice(1, 6) +
        " " +
        curPlayer.slice(-1)
      } has lost a dice. The board will be reset. And ${
        prevPlayer === "player1"
          ? "you"
          : prevPlayer.charAt(0).toUpperCase() +
            prevPlayer.slice(1, 6) +
            " " +
            prevPlayer.slice(-1)
      } will start the bids`;
      curPlayer = prevPlayer;
      prevPlayer =
        curPlayer.slice(0, 6) +
        (prevPlayer.slice(-1) - 1 === 0 ? 4 : prevPlayer.slice(-1) - 1);
    }
    turn -= 1;
  }
  winLoseMessage.classList.remove("hidden");
};

const shouldCallLiar = function () {
  if (currentBid.amount < 2) {
    return 2;
  } else if (currentBid.amount < 0.34 * totalDice) {
    return randomInt(15);
  } else if (currentBid.amount < 0.5 * totalDice) {
    return randomInt(8);
  } else if (currentBid.amount < 0.6 * totalDice) {
    return randomInt(4);
  } else if (currentBid.amount < 0.7 * totalDice) {
    return randomInt(2);
  } else {
    let arr = [1, 1, 1, 1, 1, 2, 2, 2];
    return arr[randomInt(arr.length - 1)];
  }
};

const logicForComputer = function () {
  clearInterval(activeDots);
  thinkText.innerHTML = "";
  if (shouldCallLiar() === 1) {
    callLiar();
  } else {
    const curPlayerDice = diceRolls[curPlayer].reduce((tally, diceValue) => {
      tally[diceValue] = (tally[diceValue] || 0) + 1;
      return tally;
    }, {});
    for (let [key, value] of Object.entries(curPlayerDice)) {
      if (key != "1" && typeof curPlayerDice["1"] != "undefined") {
        curPlayerDice[key] = value += curPlayerDice["1"];
      }
    }
    delete curPlayerDice["1"];
    let maxValue = 0;
    let comKeyChoice = "";
    for (let [key, value] of Object.entries(curPlayerDice)) {
      if (value > maxValue) {
        comKeyChoice = key;
      }
    }
    const randomizerArr = [1, 1, 1, 1, 1, 1, 2, 2];
    if (currentBid.amount < 2) {
      bid(comKeyChoice, 2);
    } else if (comKeyChoice > currentBid.face) {
      bid(comKeyChoice, currentBid.amount);
    } else if (comKeyChoice <= currentBid.face) {
      bid(
        randomizerArr[randomInt(8) - 1] === 1 ? comKeyChoice : randomInt(5) + 1,
        currentBid.amount + randomizerArr[randomInt(8) - 1]
      );
    }
  }
  if (!liar) {
    clearInterval(activeDots);
    thinkText.innerText = `
    Bid amount:  ${currentBid.amount}
    Dice face:  ${currentBid.face}`;
  }
};

const bid = function (diceFace, diceAmount) {
  if (
    (diceFace > currentBid.face && diceAmount >= currentBid.amount) ||
    (diceFace <= currentBid.face && diceAmount > currentBid.amount) ||
    (diceFace > currentBid.face && diceAmount > currentBid.amount)
  ) {
    currentBid.face = diceFace;
    currentBid.amount = diceAmount;
    currentBidText.innerText = `Current Bid
    Amount:  ${diceAmount}
    Die Face:  ${diceFace}`;

    return true;
  } else {
    alert("Your bid was too low. Make a higher bid of either value or amount");
    return false;
  }
};

const computerTurn = function () {
  currentBidContainer.style.opacity = 1;
  if (liar === true) {
    clearInterval(computerLogic);
    clearInterval(activeDots);
    return;
  }
  playerTags.forEach((value) => {
    value.classList.remove("prevPlayer");
    if (value.classList.contains("activePlayer")) {
      value.classList.add("prevPlayer");
      prevPlayer = value.innerText.toLowerCase().replace(" ", "");
    }
    value.classList.remove("activePlayer");
  });

  if (turn != Object.keys(playerDiceAmounts).length) {
    setTimeout(logicForComputer, 3500);
    if (typeof activeDots !== "undefined") {
      clearInterval(activeDots);
    }
    playerTags[turn].classList.add("activePlayer");
    playerTags.forEach((value) => {
      if (value.classList.contains("activePlayer")) {
        curPlayer = value.innerText.toLowerCase().replace(" ", "");
      }
    });
    thinkText.innerHTML = `${playerTags[turn].innerText} is thinking<span>.</span>`;
    activeDots = setInterval(function () {
      let dots = thinkText.querySelector("span");
      if (dots.innerText === "....") {
        dots.innerText = "";
      } else {
        dots.innerText += ".";
      }
    }, 500);
  } else {
    playerTags[0].classList.add("activePlayer");
    playerTags.forEach((value) => {
      if (value.classList.contains("activePlayer")) {
        curPlayer = value.innerText.toLowerCase().replace(" ", "");
      }
    });
    clearInterval(activeDots);
  }
  turn++;
  if (turn > Object.keys(playerDiceAmounts).length) {
    clearInterval(computerLogic);
    turn = 1;
    liarBtn.classList.remove("hidden");
    gameInputs.style.display = "flex";
    thinkText.innerHTML = "";
  }
};

const startState = function () {
  for (let [index, value] of Object.entries(playerDiceAmounts)) {
    rollDice(+index.slice(-1), value);
  }
  diceRolls.allDice = diceRollsAll(diceRolls);
  createDiceAmounts();
};

const reset = function () {
  liar = false;
  for (let i = 1; i < 5; i++) {
    document.querySelector(`.diceContainer${i}`).innerHTML = "";
  }
  for (let index of Object.keys(playerDiceAmounts)) {
    addDiceCups(+index.slice(-1));
  }
  startState();
  currentBid.face = 0;
  currentBid.amount = 0;
  liarBtn.classList.add("hidden");
  winLoseMessage.classList.add("hidden");
  currentBidContainer.style.opacity = 0;
  playerTags.forEach(function (value) {
    value.classList.remove("activePlayer");
    value.classList.remove("prevPlayer");
  });

  playerTags.forEach((value) => {
    if (value.innerText.toLowerCase().replace(" ", "") === curPlayer) {
      value.classList.add("activePlayer");
    }
    if (value.innerText.toLowerCase().replace(" ", "") === prevPlayer) {
      value.classList.add("prevPlayer");
    }
  });
  if (curPlayer === "player1") {
    gameInputs.style.display = "flex";
  } else {
    thinkText.innerHTML = `${
      curPlayer.charAt(0).toUpperCase() +
      curPlayer.slice(1, 6) +
      " " +
      curPlayer.slice(-1)
    } will start.`;
    setTimeout(function () {
      computerTurn();
      computerLogic = setInterval(computerTurn, 6000);
    }, 2000);
  }
};

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  instructions.classList.add("hidden");
  container.classList.remove("hidden");
});

startBtn.addEventListener("click", function (e) {
  e.preventDefault();
  for (let index of Object.keys(playerDiceAmounts)) {
    addDiceCups(+index.slice(-1));
  }
  startState();
  closeBtn.style.display = "flex";
  instructions.classList.add("hidden");
  startBtn.style.display = "none";
  container.classList.remove("hidden");
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
  if (face < 2 || face > 6) {
    alert("Type a dice value between 2 and 6\nRemember 1's are wild");
  } else if (amount <= 0 || amount > totalDice) {
    alert(`Type an amount between 1 and ${totalDice}`);
  } else {
    let shouldContinue = bid(face, amount);
    if (!shouldContinue) {
      return;
    }
    currentBidContainer.style.opacity = 1;
    diceFaceInput.blur();
    computerTurn();
    gameInputs.style.display = " none";
    computerLogic = setInterval(computerTurn, 6000);
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

liarBtn.addEventListener("click", (e) => {
  e.preventDefault();
  gameInputs.style.display = "none";
  callLiar();
});

continueBtn.addEventListener("click", (e) => {
  e.preventDefault();
  reset();
});
