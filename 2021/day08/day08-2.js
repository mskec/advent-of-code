// https://adventofcode.com/2021/day/8#part2

const path = require('path');
const fs = require('fs');

// @returns string
const findA = signals => {
  const sevenSegments = signals.filter(s => s.length === 3)[0].split('');
  const oneSegments = signals.filter(s => s.length === 2)[0].split('');

  return sevenSegments.filter(c => !oneSegments.includes(c))[0];
};

// @return [c, f]
const findCF = signals => {
  const oneSegments = signals.filter(s => s.length === 2)[0].split('');
  const sixNineZeroSignals = signals.filter(s => s.length === 6);

  let c = null;
  let f = null;
  for (let i = 0; i < sixNineZeroSignals.length; i++) {
    const signal = sixNineZeroSignals[i];
    const includesOne = signal.includes(oneSegments[0]);
    const includesOther = signal.includes(oneSegments[1]);

    if (includesOne && includesOther) {
      continue;
    }

    if (includesOne && !includesOther) {
      c = oneSegments[1];
      f = oneSegments[0];
    } else {
      c = oneSegments[0];
      f = oneSegments[1];
    }
  }

  return [c, f];
};

const findBDG = (signals, digitMap) => {
  // find 4 segment
  // find 3 segment
  const fourSegments = signals.filter(s => s.length === 4)[0].split('');
  const cfArr = [digitMap.c, digitMap.f];
  const acfArr = [digitMap.a, ...cfArr];
  const bdArr = fourSegments.filter(s => !cfArr.includes(s));
  const abcdfArr = [...acfArr, ...bdArr];

  const threeSegments = signals.filter(s => {
    const segments = s.split('');
    // has 5 segments and includes both "c" and "f"
    return segments.length === 5 && segments.filter(s => cfArr.includes(s)).length === 2;
  })[0].split('');

  const nineSegments = signals.filter(s => {
    const segments = s.split('');
    return segments.length === 6 && segments.filter(s => !abcdfArr.includes(s)).length === 1;
  })[0].split('');

  // console.log(digitMap);
  // console.log({ nineSegments });
  // console.log({ threeSegments });
  // console.log({ fourSegments });
  // console.log({ acfArr });
  // console.log({ bdArr });

  // find g
  for (let i = 0; i < nineSegments.length; i++) {
    if (!abcdfArr.includes(nineSegments[i])) {
      digitMap.g = nineSegments[i];
      break;
    }
  }

  // find d
  for (let i = 0; i < threeSegments.length; i++) {
    const s = threeSegments[i];
    if (!acfArr.includes(s) && s !== digitMap.g) {
      digitMap.d = s;
      break;
    }
  }

  // find b
  for (let i = 0; i < fourSegments.length; i++) {
    const s = fourSegments[i];
    if (s !== digitMap.c && s !== digitMap.f && s !== digitMap.d) {
      digitMap.b = s;
      break;
    }
  }
};

const findE = (signals, digitMap) => {
  const eightSegments = signals.filter(s => s.length === 7)[0];
  for (let i = 0; i < eightSegments.length; i++) {
    if (!Object.values(digitMap).includes(eightSegments[i])) {
      digitMap.e = eightSegments[i];
    }
  }
};

/*
  interface DigitMap {
    a: Segment
    b: Segment
    c: Segment
    d: Segment
    e: Segment
    f: Segment
    g: Segment
  }
  @returns DigitMap
 */
const determineDigits = signals => {
  const digitMap = { a: null, b: null, c: null, d: null, e: null, f: null, g: null };

  digitMap.a = findA(signals);
  const [c, f] = findCF(signals);
  digitMap.c = c
  digitMap.f = f;
  findBDG(signals, digitMap);
  findE(signals, digitMap);

  return digitMap;
};

const decodeOutput = (output, digitMapReverse) => {
  const digitsRaw = output.split(' ');

  const zero = ['a', 'b', 'c', 'e', 'f', 'g']
  // const one = ['c', 'f'];
  const two = ['a', 'c', 'd', 'e', 'g'];
  const three = ['a', 'c', 'd', 'f', 'g'];
  // const four = ['b', 'c', 'd', 'f'];
  const five = ['a', 'b', 'd', 'f', 'g'];
  const six = ['a', 'b', 'd', 'e', 'f', 'g'];
  // const seven = ['a', 'c', 'f'];
  // const eight = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const nine = ['a', 'b', 'c', 'd', 'f', 'g'];

  const digits = [];
  digitsRaw.forEach(digitCodes => {
    const realDigits = [];
    digitCodes.split('').forEach(d => realDigits.push(digitMapReverse[d]));

    if (realDigits.length === 2) {
      digits.push('1');
    } else if (realDigits.length === 3) {
      digits.push('7');
    } else if (realDigits.length === 4) {
      digits.push('4');
    } else if (realDigits.length === 7) {
      digits.push('8');
    } else if (realDigits.length === 6) {
      // 0, 6, 9
      if (realDigits.every(d => zero.includes(d))) {
        digits.push('0');
      } else if (realDigits.every(d => six.includes(d))) {
        digits.push('6');
      } else if (realDigits.every(d => nine.includes(d))) {
        digits.push('9');
      }
    } else {
      // 2, 5, 3
      if (realDigits.every(d => two.includes(d))) {
        digits.push('2');
      } else if (realDigits.every(d => five.includes(d))) {
        digits.push('5');
      } else if (realDigits.every(d => three.includes(d))) {
        digits.push('3');
      }
    }
  });
  return Number(digits.join(''));
};


run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const lines = input.split('\n');

  let sum = 0;
  lines.forEach(line => {
    const [signals, output] = line.split(' | ');
    const digitMap = determineDigits(signals.split(' '));
    const digitMapReverse = {};
    Object.keys(digitMap).forEach(key => digitMapReverse[digitMap[key]] = key);
    const outputDecoded = decodeOutput(output, digitMapReverse);
    sum += outputDecoded;
  });

  console.log('result:', sum);

  /*
    1. find "a" by comparing 2 and 3 segments, "a" is the letter that is not in both
    2. determine "c" and "f" by finding a 6-segment digit (representing 6) which has only "c" or "f"
   */
  // const [signals, output] = lines[0].split(' | ');
  // const digitMap = determineDigits(signals.split(' '));
  // console.log(digitMap);
  // const digitMapReverse = {};
  // Object.keys(digitMap).forEach(key => digitMapReverse[digitMap[key]] = key);
  // console.log(digitMapReverse);
  // console.log(decodeOutput(output, digitMapReverse));
}
