// https://adventofcode.com/2019/day/5#part2

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

__DEBUG__ = !!process.env.DEBUG;
run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const cntx = {
    mem: input.split(',').map(val => Number.parseInt(val)),
    pointer: 0,
    nextOp() {
      return this.mem[this.pointer];
    },
    run() {
      compute(this);
      if (!this.suspend) {
        rl.close();
      }
    },
    resume() {
      compute(this);
      if (!this.suspend) {
        rl.close();
      }
    },
  };

  cntx.run();
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

    __DEBUG__ && console.log('DEBUG', `opCode (${opCode}), paramModes (${paramModes})`);

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
    } else if (opCode === 4) {
      // Write output
      const output = cntx.mem[cntx.mem[cntx.pointer + 1]];
      console.log(output);
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

const getParam = (cntx, pos, mode) => {
  return mode === 1
    ? cntx.mem[cntx.pointer + pos] // 0 === Immediate mode
    : cntx.mem[cntx.mem[cntx.pointer + pos]]; // 1 === Position mode
};
