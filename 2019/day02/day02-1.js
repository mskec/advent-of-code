// https://adventofcode.com/2019/day/2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input     .txt'), 'utf8').trim()
);

function run(input) {
  const program = input.split(',').map(val => Number.parseInt(val));
  let pointer = 0;

  while (program[pointer] !== 99) {
    const op = program[pointer];
    if (![1, 2].includes(op)) {
      throw new Error(`Invalid opcode ${op} at program position ${pointer}`);
    }

    const valLeft = program[program[pointer + 1]];
    const valRight = program[program[pointer + 2]];
    const addrResult = program[pointer + 3];
    if (op === 1) {
      program[addrResult] = valLeft + valRight;
    } else if (op === 2) {
      program[addrResult] = valLeft * valRight;
    }
    pointer += 4;
  }

  console.log(program);
}
