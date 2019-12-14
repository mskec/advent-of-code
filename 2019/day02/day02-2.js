// https://adventofcode.com/2019/day/2#part2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const program = input.split(',').map(val => Number.parseInt(val));

  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const memory = [...program];
      memory[1] = i;
      memory[2] = j;
      compute(memory);
      if (memory[0] === 19690720) {
        console.log('Found the solution!');
        console.log(memory[0], memory[1], memory[2]);
        return;
      }
    }
  }

  console.log('Could not find the solution!');
}

function compute(program) {
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
  return program[0];
}
