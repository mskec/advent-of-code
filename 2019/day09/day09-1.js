// https://adventofcode.com/2019/day/9

const path = require('path');
const fs = require('fs');
const intcode = require('./IntcodeComputer');

__DEBUG__ = !!process.env.DEBUG;

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const memory = input.split(',').map(val => Number.parseInt(val));
  const cloneMem = mem => ([...mem]);

  const computer = new intcode.Computer();
  const cntx = new intcode.Context(cloneMem(memory), [1]);

  computer.compute(cntx);
  console.log(cntx.io.output);
}
