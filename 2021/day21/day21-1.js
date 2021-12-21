// https://adventofcode.com/2021/day/21

const path = require('path');
const fs = require('fs');

const __DEBUG__ = false;

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const [player1start, player2start] = input.split('\n')
    .map(line => line.substr('Player 1 starting position: '.length))
    .map(n => +n);

  let diceThrows = 0;
  const p1 = {
    score: 0,
    position: player1start,
  };
  const p2 = {
    score: 0,
    position: player2start,
  };

  const throwDice = dice => {
    const throws = [
      dice % 100 + 1,
      (dice + 1) % 100 + 1,
      (dice + 2) % 100 + 1,
    ];
    return throws[0] + throws[1] + throws[2];
  }

  let roundCnt = 1;
  while (p1.score < 1e3 && p2.score < 1e3) {
    let throwSum = throwDice(diceThrows);
    diceThrows += 3;
    p1.position = (p1.position + throwSum) % 10;
    if (p1.position === 0) {
      p1.position = 10;
    }
    p1.score += p1.position;
    __DEBUG__ && console.log('p1', { diceThrows, throwSum }, p1);

    if (p1.score >= 1e3) {
      break;
    }

    throwSum = throwDice(diceThrows);
    diceThrows += 3;
    p2.position = (p2.position + throwSum) % 10;
    if (p2.position === 0) {
      p2.position = 10;
    }
    p2.score += p2.position;

    __DEBUG__ && console.log('p2', { diceThrows, throwSum }, p2);
    __DEBUG__ && console.log();
    roundCnt++;
  }

  const loser = p1.score < p2.score ? p1 : p2;
  const result = loser.score * diceThrows;
  console.log('result:', result);
}
