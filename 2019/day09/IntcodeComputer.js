
class Context {
  mem;
  pointer = 0;
  relBase = 0;
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
}

class Computer {
  compute(cntx) {
    while (this.nextOp(cntx) !== 99) {
      const op = this.nextOp(cntx).toString().split('');

      __DEBUG__ && console.log('DEBUG', 'op', op);

      const opCode = Number.parseInt([op.pop(), op.pop()].reverse().join(''));
      const paramModes = [
        +op.pop() || 0,
        +op.pop() || 0,
        +op.pop() || 0,
      ];

      __DEBUG__ && console.log('DEBUG', `| opCode (${opCode}), paramModes (${paramModes})`);

      if (opCode === 1) {
        // Add values
        const valLeft = this.getParam(cntx, 1, paramModes[0]);
        const valRight = this.getParam(cntx, 2, paramModes[1]);
        const addrResult = this.getPos(cntx, 3, paramModes[2]);

        cntx.mem[addrResult] = valLeft + valRight;
        cntx.pointer += 4;

      } else if (opCode === 2) {
        // Multiply values
        const valLeft = this.getParam(cntx, 1, paramModes[0]);
        const valRight = this.getParam(cntx, 2, paramModes[1]);
        const addrResult = this.getPos(cntx, 3, paramModes[2]);

        cntx.mem[addrResult] = valLeft * valRight;
        cntx.pointer += 4;

      } else if (opCode === 3) {
        // Read input
        if (cntx.io.input.length) {
          cntx.mem[this.getPos(cntx, 1, paramModes[0])] = Number.parseInt(cntx.io.input.shift());
          cntx.pointer += 2;
          cntx.suspend = false;
        } else {
          cntx.suspend = true;
          return;
        }

      } else if (opCode === 4) {
        // Write output
        const output = this.getParam(cntx, 1, paramModes[0]);
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
        const addrResult = this.getPos(cntx, 3, paramModes[2]);
        cntx.mem[addrResult] = firstParam < secondParam ? 1 : 0;
        cntx.pointer += 4;

      } else if (opCode === 8) {
        // equals
        const firstParam = this.getParam(cntx, 1, paramModes[0]);
        const secondParam = this.getParam(cntx, 2, paramModes[1]);
        const addrResult = this.getPos(cntx, 3, paramModes[2]);
        cntx.mem[addrResult] = firstParam === secondParam ? 1 : 0;
        cntx.pointer += 4;
      } else if (opCode === 9) {
        // adjust relBase
        cntx.relBase += this.getParam(cntx, 1, paramModes[0]);
        cntx.pointer += 2;
      } else {
        throw new Error(`Invalid opcode ${opCode} at program position ${cntx.pointer}`);
      }
    }
  }

  /**
   * Returns a position in memory based on the mode
   */
  getPos(cntx, pos, mode) {
    if (mode === 0) {
      // 0 === Position mode
      return cntx.mem[cntx.pointer + pos];
    } else if (mode === 1) {
      // 1 === Immediate mode
      return cntx.pointer + pos;
    } else if (mode === 2) {
      // 2 === Relative mode
      return cntx.relBase + cntx.mem[cntx.pointer + pos];
    }
  }

  /**
   * Returns a memory value
   */
  getParam(cntx, pos, mode) {
    return cntx.mem[this.getPos(cntx, pos, mode)] || 0;
  }

  /**
   * Returns the next operation
   */
  nextOp(cntx) {
    return cntx.mem[cntx.pointer];
  }
}

module.exports = {
  Computer,
  Context,
};
