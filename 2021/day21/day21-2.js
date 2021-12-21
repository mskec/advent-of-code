// https://adventofcode.com/2021/day/21#part2

const path = require('path');
const fs = require('fs');

const END_SCORE = 21;
let calls = 0;
const memo = {
  _data: {}, // { p1s1p2s2: [p1Wins, p2Wins] }
  getKey(p1, p2) {
    return `${p1[0]},${p1[1]},${p2[0]},${p2[1]}`;
  },
  has(p1, p2) {
    return Array.isArray(this._data[this.getKey(p1, p2)]);
  },
  set(p1, p2, wins) {
    this._data[this.getKey(p1, p2)] = wins;
  },
  get(p1, p2) {
    return this._data[this.getKey(p1, p2)];
  },
};

let throws = [];
for (let i = 3; i > 0; i--) {
  for (let j = 3; j > 0; j--) {
    for (let k = 3; k > 0; k--) {
      throws.push(i + j + k);
    }
  }
}

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function move([score, position], diceThrow) {
  const player = [score, position];
  player[1] = (player[1] + diceThrow) % 10;
  if (player[1] === 0) {
    player[1] = 10;
  }
  player[0] += player[1];
  return player;
}

function countWins(p1, p2) {
  calls++;
  // console.log('countWins', p1, p2);
  if (memo.has(p1, p2)) {
    return memo.get(p1, p2);
  }
  if (p1[0] >= END_SCORE) {
    return [1, 0];
  }
  if (p2[0] >= END_SCORE) {
    return [0, 1];
  }

  let p1Wins = 0;
  let p2Wins = 0;
  for (let i = 0; i < throws.length; i++) {
    const next = move(p1, throws[i]);
    const wins = countWins(p2, next);

    p1Wins += wins[1];
    p2Wins += wins[0];
  }

  const wins = [p1Wins, p2Wins];
  memo.set(p1, p2, wins);
  return wins;
}

function run(input) {
  const [player1start, player2start] = input.split('\n')
    .map(line => line.substr('Player 1 starting position: '.length))
    .map(n => +n);

  const p1 = [0, player1start]; // [score, position]
  const p2 = [0, player2start]; // [score, position]

  countWins(p1, p2);
  const wins = memo.get(p1, p2);
  console.log('player 1 wins:', wins[0]);
  console.log('player 2 wins:', wins[1]);
  console.log('max wins:', Math.max(...wins));
  console.log('total calls:', calls);
}
