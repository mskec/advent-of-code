// https://adventofcode.com/2019/day/11

const path = require('path');
const fs = require('fs');
const intcode = require('../day09/IntcodeComputer');

__DEBUG__ = false;

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const memory = input.split(',').map(val => Number.parseInt(val));

  const computer = new intcode.Computer();
  const cntx = new intcode.Context(memory);

  const height = 100;
  const width = 100;
  const map = initMap(width, height);
  const paintedPanels = {};
  const pos = {
    x: Math.floor(width / 2),
    y: Math.floor(height / 2),
    dir: '^',
  };

  let i = 0;
  const moveMap = {
    '^': { 0: '<', 1: '>' },
    '<': { 0: 'v', 1: '^' },
    'v': { 0: '>', 1: '<' },
    '>': { 0: '^', 1: 'v' },
  };
  while (computer.nextOp(cntx) !== 99) {
    cntx.io.input.push(map[pos.y][pos.x] === '.' ? 0 : 1);
    computer.compute(cntx);

    const panelColor = cntx.io.output.shift() === 0 ? '.' : '#';
    map[pos.y][pos.x] = panelColor;
    pos.dir = moveMap[pos.dir][cntx.io.output.shift()];

    if (panelColor === '#') {
      paintedPanels[`${pos.x},${pos.y}`] = true;
    }

    if (pos.dir === '^') {
      pos.y -= 1;
    } else if (pos.dir === '<') {
      pos.x -= 1;
    } else if (pos.dir === 'v') {
      pos.y += 1;
    } else if (pos.dir === '>') {
      pos.x += 1;
    }

    i++;
  }
  console.log('\nMove:', i + 1);
  print(map);
  console.log(pos);
  console.log('Painted panels (at least once)', Object.keys(paintedPanels).length); // 1883
}

function initMap(width, height) {
  const map = [];
  for (let i = 0; i < height; i++) {
    map.push([]);
    for (let j = 0; j < width; j++) {
      map[i].push('.');
    }
  }
  return map;
}

function print(map) {
  for (let i = 0; i < map.length; i++) {
    console.log(map[i].join(''));
  }
}

