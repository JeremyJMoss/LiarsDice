"use strict";

const diceRoll = (sides) => Math.ceil(Math.random() * sides);

const displayDice = function (container) {
  const diceContainer = document.querySelector(`.diceContainer${container}`);
  const roll = diceRoll(6);
  const dice = `<img src="/dice-${roll}.jpg" alt="dice on face ${roll}" class="diceImg" />`;
  diceContainer.insertAdjacentHTML("beforeend", dice);
};

for (let i = 0; i < 5; i++) {
  displayDice(1);
  displayDice(2);
  displayDice(3);
  displayDice(4);
}
