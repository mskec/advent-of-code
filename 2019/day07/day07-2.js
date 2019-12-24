// https://adventofcode.com/2019/day/7#part2

const path = require('path');
const fs = require('fs');
const permutation = require('../../utils/permutation');
const intcode = require('./IntcodeComputer');

__DEBUG__ = !!process.env.DEBUG;

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const memory = input.split(',').map(val => Number.parseInt(val));
  const cloneMem = mem => ([...mem]);

  const computer = new intcode.Computer();

  let maxThrusterSignal = 0;
  let maxPhaseSettings;

  const permutations = permutation('56789');
  permutations.forEach(perm => {
    const phaseSettings = perm.split('').map(val => Number.parseInt(val));

    // First loop
    const cntxA = new intcode.Context(cloneMem(memory));
    const cntxB = new intcode.Context(cloneMem(memory));
    const cntxC = new intcode.Context(cloneMem(memory));
    const cntxD = new intcode.Context(cloneMem(memory));
    const cntxE = new intcode.Context(cloneMem(memory));

    cntxA.io.input = cntxE.io.output;
    cntxB.io.input = cntxA.io.output;
    cntxC.io.input = cntxB.io.output;
    cntxD.io.input = cntxC.io.output;
    cntxE.io.input = cntxD.io.output;
    cntxA.io.input.push(phaseSettings[0], 0);
    cntxB.io.input.push(phaseSettings[1]);
    cntxC.io.input.push(phaseSettings[2]);
    cntxD.io.input.push(phaseSettings[3]);
    cntxE.io.input.push(phaseSettings[4]);

    let i = 0;
    while (cntxA.nextOp() !== 99) {
      __DEBUG__ && console.log('iter', i);
      computer.compute(cntxA);
      __DEBUG__ && console.log('| A', cntxA.io.output);
      computer.compute(cntxB);
      __DEBUG__ && console.log('| B', cntxB.io.output);
      computer.compute(cntxC);
      __DEBUG__ && console.log('| C', cntxC.io.output);
      computer.compute(cntxD);
      __DEBUG__ && console.log('| D', cntxD.io.output);
      computer.compute(cntxE);
      __DEBUG__ && console.log('| E', cntxE.io.output);
      i++;
    }

    if (cntxE.io.output[0] > maxThrusterSignal) {
      maxThrusterSignal = cntxE.io.output[0];
      maxPhaseSettings = phaseSettings;
    }
  });

  console.log('Max thruster signal:', maxThrusterSignal); // 21596786
  console.log('Phase settings:', maxPhaseSettings); // [9, 5, 8, 6, 7]
}
