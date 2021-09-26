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
/*contains the face and the ammount of the current bid in an object*/
let currentBid = {
  face: 0,
  amount: 0,
};
let turn = 1;
let liar = false;
let activeDots;

const randomInt = (range) => Math.ceil(Math.random() * range);

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

/*for when either the computer or the player calls liar*/
const callLiar = function (e) {
  e.preventDefault();
  liar = true;
  let player;

  if (
    diceRolls.allDice[currentBid.face] + diceRolls.allDice[1] <=
    currentBid.amount
  ) {
    for (let player of playerTags) {
      if (player.classList.contains("activePlayer")) {
        player = player.innerText;
      }
    }
  }
};

const shouldCallLiar = function () {
  if (currentBid.amount < 5) {
  }
};

const LogicForComputer = function () {
  let currentPlayer;
  for (let player of playerTags) {
    if (player.classList.contains("activePlayer"))
      currentPlayer = player.innerText.toLowerCase().replace(" ", "");
  }
  const curPlayerDice = diceRolls[currentPlayer].reduce((tally, diceValue) => {
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
};

const bid = function (diceFace, diceAmount) {
  if (
    (diceFace > currentBid.face && diceAmount <= currentBid.amount) ||
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
  for (let i = 1; i < 5; i++) {
    addDiceCups(i);
    rollDice(i, 5);
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
  shouldCallLiar();
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
        return;
      }
      playerTags.forEach((value) => {
        value.classList.remove("activePlayer");
      });

      if (turn != 4) {
        if (typeof activeDots !== "undefined") {
          clearInterval(activeDots);
        }
        playerTags[turn].classList.add("activePlayer");
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

liarBtn.addEventListener("click", callLiar);
