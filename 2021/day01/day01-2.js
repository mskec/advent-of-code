// https://adventofcode.com/2021/day/1#part2

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

  let numOfIncreases = 0;
  let sum = depths[0] + depths[1] + depths[2];
  for (let i = 3; i < depths.length; i++) {
    const nextSum = sum - depths[i - 3] + depths[i];
    const isIncrease = nextSum > sum;
    if (isIncrease) {
      numOfIncreases++;
    }
    console.log(sum, isIncrease ? 'increased' : 'decreased');
    sum = nextSum;
  }

  console.log('Depth increases:', numOfIncreases);
}
