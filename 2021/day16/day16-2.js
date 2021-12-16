// https://adventofcode.com/2021/day/16#part2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function toBinaryArr(hexArr) {
  return hexArr
    .split('')
    .map(i => parseInt(i, 16).toString(2).padStart(4, '0'))
    .join('');
}

function readBits(ptr, cnt, bin) {
  return bin.slice(ptr, ptr + cnt);
}

function toDecimal(bin) {
  return parseInt(bin, 2);
}

function processOperator(type, values) {
  switch(type) {
    case 0: {
      // sum operator
      return values.reduce((agg, val) => agg + val, 0);
    }
    case 1: {
      // product operator
      return values.reduce((agg, val) => agg * val, 1);
    }
    case 2: {
      // min operator
      let min = Number.MAX_VALUE;
      values.forEach(val => {
        if (val < min) {
          min = val;
        }
      });
      return min;
    }
    case 3: {
      // max operator
      let max = Number.MIN_VALUE;
      values.forEach(val => {
        if (val > max) {
          max = val;
        }
      });
      return max;
    }
    case 5: {
      return values[0] > values[1] ? 1 : 0;
    }
    case 6: {
      return values[0] < values[1] ? 1 : 0;
    }
    case 7: {
      return values[0] === values[1] ? 1 : 0;
    }
    default: {
      throw Error(`unknown operator type ${type}`);
    }
  }
}

function parsePacket(ptr, bin, inOperator = false) {
  let packetReadCnt = 0;
  let value = 0;
  const [version, type, readCnt] = parseHeader(ptr + packetReadCnt, bin);
  packetReadCnt += readCnt;

  console.log('> version:', version, 'type:', type);

  if (Number.isNaN(version) || Number.isNaN(type)) {
    console.log('< stop');
    return [packetReadCnt];
  } else if (type === 4) {
    // parse literal packet
    const [literalValue, readCnt] = parseLiteralPacket(ptr + packetReadCnt, bin, !inOperator);
    packetReadCnt += readCnt;
    value = literalValue;
    console.log('> literal packet:', literalValue);

  } else {
    // parse operator packet
    const [lengthTypeId, num, readCnt] = parseOperationPacket(ptr + packetReadCnt, bin);
    packetReadCnt += readCnt;
    console.log('> operator packet:', lengthTypeId, 'num:', num);

    const subValues = [];
    if (lengthTypeId === 0) {
      let subReadCnt = 0;
      while (subReadCnt < num) {
        console.log('> sub packet pointer:', ptr + packetReadCnt);
        const [subPacketValue, readCnt] = parsePacket(ptr + packetReadCnt, bin, true);
        subReadCnt += readCnt;
        packetReadCnt += readCnt;
        subValues.push(subPacketValue);
      }
    } else if (lengthTypeId === 1) {
      let subPacketsRead = 0;
      while (subPacketsRead < num) {
        console.log('> sub packet pointer:', ptr + packetReadCnt);
        const [subPacketValue, readCnt] = parsePacket(ptr + packetReadCnt, bin, true);
        subPacketsRead += 1;
        packetReadCnt += readCnt;
        subValues.push(subPacketValue);
      }
    } else {
      throw Error(`unknown length type: ${num}`)
    }
    value = processOperator(type, subValues);
  }

  return [value, packetReadCnt];
}

function parseHeader(ptr, bin) {
  const version = toDecimal(readBits(ptr, 3, bin));
  const type = toDecimal(readBits(ptr + 3, 3, bin));
  return [version, type, 6];
}

function parseLiteralPacket(ptr, bin, hasPadding = true) {
  let readCnt = 0;
  let readLastGroup = false;
  const value = [];
  while (!readLastGroup) {
    const [flag, ...valueBits] = readBits(ptr + readCnt, 5, bin);
    readCnt += 5;

    if (flag === '0') {
      // the last group
      readLastGroup = true;
    }

    value.push(valueBits.join(''));
  }

  const totalReadCnt = readCnt + 6; // 3 from version + 3 from type
  if (hasPadding && totalReadCnt % 4 !== 0) {
    readCnt += 4 - totalReadCnt % 4;
  }

  return [toDecimal(value.join('')), readCnt];
}

function parseOperationPacket(ptr, bin) {
  let readCnt = 0;
  const lengthTypeId = toDecimal(readBits(ptr + readCnt, 1, bin));
  readCnt += 1;

  const bitsToRead = lengthTypeId === 0 ? 15 : 11;
  const num = toDecimal(readBits(ptr + readCnt, bitsToRead, bin));
  readCnt += bitsToRead;

  return [lengthTypeId, num, readCnt];
}

function run(input) {
  const bin = toBinaryArr(input);
  console.log(bin);

  let ptr = 0;
  let packet = 0;
  const result = [];
  while (bin.length - ptr > 6) {
    packet++;
    console.log('packet:', packet, 'pointer:', ptr);
    const [value, readCnt] = parsePacket(ptr, bin);
    ptr += readCnt;
    result.push(value);
  }

  console.log('result', result);
}
