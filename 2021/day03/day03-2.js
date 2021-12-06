// https://adventofcode.com/2021/day/3#part2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const readings = input.split('\n');
  const readingLen = readings[0].length;

  const sumBits = (readings, idx) => {
    let sum = 0;
    readings.forEach(reading => {
      sum += +reading[idx];
    });
    return sum;
  }

  // console.log('oxygen');
  let idx = 0;
  let oxygenReadings = [...readings];
  while (oxygenReadings.length !== 1 && idx < readingLen) {
    // search for 1s or 0s
    let bit = sumBits(oxygenReadings, idx) >= oxygenReadings.length / 2 ? 1 : 0;
    oxygenReadings = oxygenReadings.filter(reading => +reading[idx] === bit);
    // console.log(idx, bit, oxygenReadings);
    idx++;
  }

  // console.log('co2Scrubber');
  idx = 0;
  let co2ScrubberReadings = [...readings];
  while (co2ScrubberReadings.length !== 1 && idx < readingLen) {
    // search for 1s or 0s
    let bit = sumBits(co2ScrubberReadings, idx) >= co2ScrubberReadings.length / 2 ? 0 : 1;
    co2ScrubberReadings = co2ScrubberReadings.filter(reading => +reading[idx] === bit);
    // console.log(idx, bit, co2ScrubberReadings);
    idx++;
  }

  const oxygen = Number.parseInt(oxygenReadings[0], 2);
  const co2Scrubber = Number.parseInt(co2ScrubberReadings[0], 2);
  const lifeSupport = oxygen * co2Scrubber;

  console.log({ oxygen, co2Scrubber, lifeSupport });
}
