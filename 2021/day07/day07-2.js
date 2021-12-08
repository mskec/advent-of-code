// https://adventofcode.com/2021/day/7#part2

// result: 99634572

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
    // console.log('calc fuel', i, crabs[i]);
    const fuel = crabs.reduce((agg, crab, idx) => {
      // n*(n+1)/2
      const n = Math.abs(crab - i);
      // console.log(`crabs[${idx}]`, crab, n * (n + 1) / 2);
      return agg + (n > 0 ? (n * (n+1) / 2) : 0);
    }, 0);

    // console.log('position:', crabs[i]);
    // console.log('fuel:', fuel);
    // console.log();
    if (fuel < minFuel) {
      minFuel = fuel;
      position = i;
    }
  }

  console.log('fuel:', minFuel);
  console.log('position:', position);
}
