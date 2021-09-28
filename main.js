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

const randomInt = (range) => Math.ceil(Math.random() * range);

const playerDiceAmounts = {
  player1: 5,
  player2: 5,
  player3: 5,
  player4: 5,
};

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

  if (
    diceRolls.allDice[currentBid.face] + diceRolls.allDice[1] <=
    currentBid.amount
  ) {
    playerDiceAmounts[prevPlayer] -= 1;

    if (curPlayer === "player1") {
      message.innerText = `You have won this round! Congratulations! The board will be reset with ${
        prevPlayer.charAt(0).toUpperCase() +
        prevPlayer.slice(1, 6) +
        " " +
        prevPlayer.slice(-1)
      } having 1 less die.`;
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
      } having 1 less die.`;
    }
  } else {
    playerDiceAmounts[curPlayer] -= 1;
    if (curPlayer === "player1") {
      message.innerText = `You have guessed wrong! The board will reset with your dice being reduced by 1`;
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
        curPlayer.slice(-1) +
        " has"
      } lost a dice. The board will be reset.`;
    }
  }
  winLoseMessage.classList.remove("hidden");
};

const shouldCallLiar = function () {
  if (currentBid.amount < 5) {
    return randomInt(20);
  } else if (currentBid.amount < 7) {
    return randomInt(10);
  } else if (currentBid.amount < 9) {
    return randomInt(5);
  } else if (currentBid.amount < 11) {
    return randomInt(3);
  } else {
    return randomInt(2);
  }
};

const logicForComputer = function () {
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
    if (comKeyChoice > currentBid.face) {
      bid(comKeyChoice, currentBid.amount);
    } else if (comKeyChoice <= currentBid.face) {
      bid(
        randomizerArr[randomInt(8) - 1] === 1 ? comKeyChoice : randomInt(5) + 1,
        currentBid.amount + randomizerArr[randomInt(8) - 1]
      );
    }
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

const startState = function () {
  let contain;
  for (let [index, value] of Object.entries(playerDiceAmounts)) {
    contain = index.charAt(index.length - 1);
    rollDice(contain, value);
  }
  diceRolls.allDice = diceRollsAll(diceRolls);
};

closeBtn.addEventListener("click", function (e) {
  e.preventDefault();
  instructions.classList.add("hidden");
  container.classList.remove("hidden");
});

startBtn.addEventListener("click", function (e) {
  e.preventDefault();
  for (let i = 1; i < 5; i++) {
    addDiceCups(i);
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
  } else if (amount <= 0 || amount > 20) {
    alert("Type an amount between 1 and 20");
  } else {
    let shouldContinue = bid(face, amount);
    if (!shouldContinue) {
      return;
    }
    currentBidContainer.style.opacity = 1;
    diceFaceInput.blur();
    const computerTurn = function () {
      if (liar) {
        clearInterval(computerLogic);
        clearInterval(activeDots);
        thinkText.innerHTML = "";

        return;
      }
      playerTags.forEach((value) => {
        value.classList.remove("prevPlayer");
        if (value.classList.contains("activePlayer")) {
          value.classList.add("prevPlayer");
          prevPlayer = value.innerText.toLowerCase().replace(" ", "");
        }
      });

      playerTags.forEach((value) => {
        value.classList.remove("activePlayer");
      });

      if (turn != 4) {
        setTimeout(logicForComputer, 4500);
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
      if (turn > 4) {
        clearInterval(computerLogic);
        turn = 1;
        liarBtn.classList.remove("hidden");
        gameInputs.style.display = "flex";
        thinkText.innerHTML = "";
      }
    };
    computerTurn();
    gameInputs.style.display = " none";
    const computerLogic = setInterval(computerTurn, 5000);
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

liarBtn.addEventListener("click", function (e) {
  e.preventDefault();
  callLiar();
  gameInputs.style.display = "none";
});

continueBtn.addEventListener("click", function (e) {
  e.preventDefault();
  for (let i = 1; i < 5; i++) {
    const diceContainer = (document.querySelector(
      `.diceContainer${i}`
    ).innerHTML = "");
    addDiceCups(i);
  }
  startState();
  currentBid.face = 0;
  currentBid.amount = 0;
  liarBtn.classList.add("hidden");
  winLoseMessage.classList.add("hidden");
  gameInputs.style.display = "flex";
  currentBidContainer.style.opacity = 0;
  liar = false;
});
