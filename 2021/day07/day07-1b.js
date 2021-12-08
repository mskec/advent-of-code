// https://adventofcode.com/2021/day/7

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const crabs = input.split(',').map(c => +c); // convert to a number

  crabs.sort((a, b) => a - b);

  let position = 0;
  let minFuel = Number.MAX_VALUE;
  for (let i = crabs[0]; i < crabs[crabs.length - 1]; i++) {
    const fuel = crabs.reduce((agg, crab, idx) => agg + Math.abs(crab - i), 0);

    if (fuel < minFuel) {
      minFuel = fuel;
      position = i;
    }
  }

  console.log('fuel:', minFuel);
  console.log('position:', position);
}
