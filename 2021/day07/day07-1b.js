// https://adventofcode.com/2021/day/7

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const crabs = input.split(',').map(c => +c); // convert to a number

  const sum = crabs.reduce((agg, c) => agg + c, 0);
  console.log(sum / crabs.length);

  crabs.sort((a, b) => a - b);

  const median = crabs[Math.floor(crabs.length / 2)];

  const fuel = crabs.reduce((agg, crab) => agg + Math.abs(crab - median), 0);
  console.log({ median, fuel });
}
