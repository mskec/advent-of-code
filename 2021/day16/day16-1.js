// https://adventofcode.com/2021/day/16

const path = require('path');
const fs = require('fs');

let versionSum = 0;

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

function parsePacket(ptr, bin, inOperator = false) {
  let packetReadCnt = 0;
  const [version, type, readCnt] = parseHeader(ptr + packetReadCnt, bin);
  packetReadCnt += readCnt;
  versionSum += version;

  // versionSum += version;
  console.log('> version:', version, 'type:', type);

  if (Number.isNaN(version) || Number.isNaN(type)) {
    console.log('stop');
    return [packetReadCnt];
  } else if (type === 4) {
    // parse literal packet
    const [value, readCnt] = parseLiteralPacket(ptr + packetReadCnt, bin, !inOperator);
    packetReadCnt += readCnt;
    console.log('> literal packet:', value);

  } else {
    // parse operator packet
    const [lengthTypeId, num, readCnt] = parseOperationPacket(ptr + packetReadCnt, bin);
    packetReadCnt += readCnt;
    console.log('> operator packet:', lengthTypeId, 'num:', num);

    if (lengthTypeId === 0) {
      let subReadCnt = 0;
      while (subReadCnt < num) {
        console.log('> sub packet pointer:', ptr + packetReadCnt);
        const [readCnt] = parsePacket(ptr + packetReadCnt, bin, true);
        subReadCnt += readCnt;
        packetReadCnt += readCnt;
      }
    } else if (lengthTypeId === 1) {
      let subPacketsRead = 0;
      while (subPacketsRead < num) {
        console.log('> sub packet pointer:', ptr + packetReadCnt);
        const [readCnt] = parsePacket(ptr + packetReadCnt, bin, true);
        subPacketsRead += 1;
        packetReadCnt += readCnt;
      }
    } else {
      throw Error(`unknown length type: ${num}`)
    }
  }

  return [packetReadCnt];
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
  while (bin.length - ptr > 6) {
    packet++;
    console.log('packet:', packet, 'pointer:', ptr);
    const [readCnt] = parsePacket(ptr, bin);
    ptr += readCnt;
  }

  console.log('version sum:', versionSum);
}
