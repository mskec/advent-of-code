// https://adventofcode.com/2019/day/1

const path = require('path');
const fs = require('fs');

function calculateMass(mass) {
  return Math.floor(mass / 3) - 2;
}

let sum = 0;

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const modules = input.split('\n');
modules.forEach(mass => {
  if (mass) {
    sum += calculateMass(mass);
  }
});

console.log(sum);
