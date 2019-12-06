// https://adventofcode.com/2019/day/1#part2
const path = require('path');
const fs = require('fs');

function calculateMass(mass) {
  return Math.max(Math.floor(mass / 3) - 2, 0);
}

const input = fs.readFileSync(path.join(__dirname, './input.txt'), 'utf8');
const modules = input.split('\n');

let sum = 0;
modules.forEach(mass => {
  if (mass) {
    const moduleFuel = calculateMass(mass);
    
    let additionalFuel = 0;
    let remainingMass = moduleFuel;
    while (remainingMass > 0) {
      remainingMass = calculateMass(remainingMass);
      additionalFuel += remainingMass;
    }
    
    sum += moduleFuel + additionalFuel;
  }
});

console.log(sum); // 4940441
