// https://adventofcode.com/2019/day/7

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const permutation = require('../../utils/permutation');
const intcode = require('./IntcodeComputer');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.close();

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
  const permutations = permutation('01234');
  permutations.forEach(perm => {
    const phaseSettings = perm.split('').map(val => Number.parseInt(val));

    const cntxA = new intcode.Context(cloneMem(memory), [phaseSettings[0], 0]);
    computer.compute(cntxA);

    const cntxB = new intcode.Context(cloneMem(memory), [phaseSettings[1], cntxA.io.output[0]]);
    computer.compute(cntxB);

    const cntxC = new intcode.Context(cloneMem(memory), [phaseSettings[2], cntxB.io.output[0]]);
    computer.compute(cntxC);

    const cntxD = new intcode.Context(cloneMem(memory), [phaseSettings[3], cntxC.io.output[0]]);
    computer.compute(cntxD);

    const cntxE = new intcode.Context(cloneMem(memory), [phaseSettings[4], cntxD.io.output[0]]);
    computer.compute(cntxE);


    if (cntxE.io.output[0] > maxThrusterSignal) {
      maxThrusterSignal = cntxE.io.output[0];
      maxPhaseSettings = phaseSettings;
    }
  });

  console.log('Max thruster signal:', maxThrusterSignal); // 366376
  console.log('Phase settings:', maxPhaseSettings); // [2, 3, 0, 4, 1]
}
