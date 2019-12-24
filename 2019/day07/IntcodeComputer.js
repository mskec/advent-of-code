
class Context {
  mem;
  pointer = 0;
  io = {
    input: [],
    output: []
  };

  constructor(mem, input) {
    this.mem = mem;
    if (input) {
      this.io.input = input;
    }
  }

  nextOp() {
    return this.mem[this.pointer];
  }
}

class Computer {
  compute(cntx) {
    while (cntx.nextOp() !== 99) {
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
        const valLeft = this.getParam(cntx, 1, paramModes[0]);
        const valRight = this.getParam(cntx, 2, paramModes[1]);
        const addrResult = cntx.mem[cntx.pointer + 3];

        cntx.mem[addrResult] = valLeft + valRight;
        cntx.pointer += 4;

      } else if (opCode === 2) {
        // Multiply values
        const valLeft = this.getParam(cntx, 1, paramModes[0]);
        const valRight = this.getParam(cntx, 2, paramModes[1]);
        const addrResult = cntx.mem[cntx.pointer + 3];

        cntx.mem[addrResult] = valLeft * valRight;
        cntx.pointer += 4;

      } else if (opCode === 3) {
        // Read input
        if (cntx.io.input.length) {
          cntx.mem[cntx.mem[cntx.pointer + 1]] = Number.parseInt(cntx.io.input.shift());
          cntx.pointer += 2;
          cntx.suspend = false;
        } else {
          cntx.suspend = true;
          return;
        }

      } else if (opCode === 4) {
        // Write output
        const output = cntx.mem[cntx.mem[cntx.pointer + 1]];
        cntx.io.output.push(output);
        cntx.pointer += 2;

      } else if (opCode === 5) {
        // jump-if-true 1005,1,10 -> sets points to 10
        const param = this.getParam(cntx, 1, paramModes[0]);
        cntx.pointer = param !== 0 ? this.getParam(cntx, 2, paramModes[1]) : cntx.pointer + 3;

      } else if (opCode === 6) {
        // jump-if-false 1006,0,10 -> sets pointer to 10
        const param = this.getParam(cntx, 1, paramModes[0]);
        cntx.pointer = param === 0 ? this.getParam(cntx, 2, paramModes[1]) : cntx.pointer + 3;

      } else if (opCode === 7) {
        // less than
        const firstParam = this.getParam(cntx, 1, paramModes[0]);
        const secondParam = this.getParam(cntx, 2, paramModes[1]);
        cntx.mem[cntx.mem[cntx.pointer + 3]] = firstParam < secondParam ? 1 : 0;
        cntx.pointer += 4;

      } else if (opCode === 8) {
        // equals
        const firstParam = this.getParam(cntx, 1, paramModes[0]);
        const secondParam = this.getParam(cntx, 2, paramModes[1]);
        cntx.mem[cntx.mem[cntx.pointer + 3]] = firstParam === secondParam ? 1 : 0;
        cntx.pointer += 4;
      }
    }
  }

  getParam(cntx, pos, mode) {
    return mode === 1
      ? cntx.mem[cntx.pointer + pos] // 0 === Immediate mode
      : cntx.mem[cntx.mem[cntx.pointer + pos]]; // 1 === Position mode
  }
}

module.exports = {
  Computer,
  Context,
};
