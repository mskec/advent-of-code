// https://adventofcode.com/2021/day/1

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const depths = input.split('\n').map(depth => +depth); // convert to a number

  if (depths.length < 2) {
    console.log('Depth increases:', 0);
    return;
  }

  console.log(depths[0]);

  let numOfIncreases = 0;
  for (let i = 1; i < depths.length; i++) {
    const isIncrease = depths[i] > depths[i - 1];
    if (isIncrease) {
      numOfIncreases++;
    }
    console.log(depths[i], isIncrease ? 'increased' : 'decreased');
  }

  console.log('Depth increases:', numOfIncreases);
}
