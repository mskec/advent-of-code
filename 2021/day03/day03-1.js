// https://adventofcode.com/2021/day/3

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const readings = input.split('\n');

  const readingLen = readings[0].length;
  const bits = Array(readingLen).fill(0);
  readings.forEach(reading => {
    for (let i = 0; i < readingLen; i++) {
      bits[i] += +reading[i];
    }
  });

  const gammaDigits = [];
  const epsilonDigits = [];
  console.log({ bits });
  for (let i = 0; i < readingLen; i++) {
    if (bits[i] >= readings.length / 2) {
      gammaDigits.push('1');
      epsilonDigits.push('0');
    } else {
      gammaDigits.push('0');
      epsilonDigits.push('1');
    }
  }

  console.log({ gammaDigits, epsilonDigits });
  const gamma = Number.parseInt(gammaDigits.join(''), 2);
  const epsilon = Number.parseInt(epsilonDigits.join(''), 2);
  const power = gamma * epsilon;

  console.log({ gamma, epsilon, power });
}
