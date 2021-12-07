// https://adventofcode.com/2021/day/6#part2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const fishes = input.trim().split(',').map(f => +f); // convert to a number

  const fishByAge = Array(9).fill(0);

  fishes.forEach(fish => { fishByAge[fish] += 1 });

  // simulate aging
  for (let i = 0; i < 256; i++) {
    const newFish = fishByAge[0];
    fishByAge[0] = fishByAge[1];
    fishByAge[1] = fishByAge[2];
    fishByAge[2] = fishByAge[3];
    fishByAge[3] = fishByAge[4];
    fishByAge[4] = fishByAge[5];
    fishByAge[5] = fishByAge[6];
    fishByAge[6] = fishByAge[7] + newFish;
    fishByAge[7] = fishByAge[8];
    fishByAge[8] = newFish;
  }

  const result = Object.keys(fishByAge).reduce((agg, age) => agg + fishByAge[age], 0);
  console.log('result:', result);
}
