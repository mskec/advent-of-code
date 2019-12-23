// https://adventofcode.com/2019/day/7

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const permutation = require('../../utils/permutation');

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

  let maxThrusterSignal = 0;
  let maxPhaseSettings;
  const permutations = permutation('01234');
  permutations.forEach(perm => {
    const phaseSettings = perm.split('').map(val => Number.parseInt(val));

    const cntxA = createContext(cloneMem(memory), [phaseSettings[0], 0]);
    cntxA.run();

    const cntxB = createContext(cloneMem(memory), [phaseSettings[1], cntxA.io.output[0]]);
    cntxB.run();

    const cntxC = createContext(cloneMem(memory), [phaseSettings[2], cntxB.io.output[0]]);
    cntxC.run();

    const cntxD = createContext(cloneMem(memory), [phaseSettings[3], cntxC.io.output[0]]);
    cntxD.run();

    const cntxE = createContext(cloneMem(memory), [phaseSettings[4], cntxD.io.output[0]]);
    cntxE.run();


    if (cntxE.io.output[0] > maxThrusterSignal) {
      maxThrusterSignal = cntxE.io.output[0];
      maxPhaseSettings = phaseSettings;
    }
  });

  console.log('Max thruster signal:', maxThrusterSignal); // 366376
  console.log('Phase settings:', maxPhaseSettings); // [2, 3, 0, 4, 1]
}

function createContext(memory, input) {
  let io;
  if (input) {
    io = {
      input,
      output: [],
    };
  }

  return {
    mem: memory,
    pointer: 0,
    io,
    nextOp() {
      return this.mem[this.pointer];
    },
    run() {
      compute(this);
      if (!this.suspend && !this.io) {
        rl.close();
      }
    },
    resume() {
      compute(this);
      if (!this.suspend && !this.io) {
        rl.close();
      }
    },
  };
}

function compute(cntx) {
  while (!cntx.suspend && cntx.nextOp() !== 99) {
    const op = cntx.nextOp().toString().split('');

    __DEBUG__ && console.log('DEBUG', 'op', op);

    const opCode = Number.parseInt([op.pop(), op.pop()].reverse().join(''));
    const paramModes = [
      +op.pop() || 0,
      +op.pop() || 0,
      +op.pop() || 0,
    ];

    __DEBUG__ && console.log('DEBUG', `| opCode (${opCode}), paramModes (${paramModes})`);

    if (![1, 2, 3, 4, 5, 6, 7, 8].includes(opCode)) {
      throw new Error(`Invalid opcode ${opCode} at program position ${cntx.pointer}`);
    }

    if (opCode === 1) {
      // Add values
      const valLeft = getParam(cntx, 1, paramModes[0]);
      const valRight = getParam(cntx, 2, paramModes[1]);
      const addrResult = cntx.mem[cntx.pointer + 3];

      cntx.mem[addrResult] = valLeft + valRight;
      cntx.pointer += 4;
    } else if (opCode === 2) {
      // Multiply values
      const valLeft = getParam(cntx, 1, paramModes[0]);
      const valRight = getParam(cntx, 2, paramModes[1]);
      const addrResult = cntx.mem[cntx.pointer + 3];

      cntx.mem[addrResult] = valLeft * valRight;
      cntx.pointer += 4;
    } else if (opCode === 3) {
      // Read input
      if (cntx.io) {
        cntx.mem[cntx.mem[cntx.pointer + 1]] = Number.parseInt(cntx.io.input.shift());
        cntx.pointer += 2;
      } else {
        rl.question('❯ ', input => {
          try {
            cntx.mem[cntx.mem[cntx.pointer + 1]] = Number.parseInt(input);
          } catch (e) {
            throw new Error('Invalid input. Expecting an integer!');
          }
          cntx.suspend = false;
          cntx.pointer += 2;
          cntx.resume();
        });
        cntx.suspend = true;
      }
    } else if (opCode === 4) {
      // Write output
      const output = cntx.mem[cntx.mem[cntx.pointer + 1]];
      if (cntx.io) {
        cntx.io.output.push(output);
      } else {
        console.log(output);
      }
      cntx.pointer += 2;
    } else if (opCode === 5) {
      // jump-if-true 1005,1,10 -> sets points to 10
      const param = getParam(cntx, 1, paramModes[0]);
      cntx.pointer = param !== 0 ? getParam(cntx, 2, paramModes[1]) : cntx.pointer + 3;
    } else if (opCode === 6) {
      // jump-if-false 1006,0,10 -> sets pointer to 10
      const param = getParam(cntx, 1, paramModes[0]);
      cntx.pointer = param === 0 ? getParam(cntx, 2, paramModes[1]) : cntx.pointer + 3;
    } else if (opCode === 7) {
      // less than
      const firstParam = getParam(cntx, 1, paramModes[0]);
      const secondParam = getParam(cntx, 2, paramModes[1]);
      cntx.mem[cntx.mem[cntx.pointer + 3]] = firstParam < secondParam ? 1 : 0;
      cntx.pointer += 4;
    } else if (opCode === 8) {
      // equals
      const firstParam = getParam(cntx, 1, paramModes[0]);
      const secondParam = getParam(cntx, 2, paramModes[1]);
      cntx.mem[cntx.mem[cntx.pointer + 3]] = firstParam === secondParam ? 1 : 0;
      cntx.pointer += 4;
    }
  }
}

function getParam(cntx, pos, mode) {
  return mode === 1
    ? cntx.mem[cntx.pointer + pos] // 0 === Immediate mode
    : cntx.mem[cntx.mem[cntx.pointer + pos]]; // 1 === Position mode
}
