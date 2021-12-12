// https://adventofcode.com/2021/day/11

const path = require('path');
const fs = require('fs');

const increasePower = octoArr => {
  for (let i = 0; i < octoArr.length; i++) {
    for (let j = 0; j < octoArr[i].length; j++) {
      octoArr[j][i].power += 1;
    }
  }
}

const simulateFlashes = octoArr => {
  let totalFlashes = 0;
  for (let j = 0; j < octoArr.length; j++) {
    for (let i = 0; i < octoArr[j].length; i++) {
      const octo = octoArr[j][i];
      if (octo.power > 9 && !octo.flashed) {
        totalFlashes += 1;
        octo.flashed = true;

        const iMask = [-1, 0, 1, 1, 1, 0, -1, -1];
        const jMask = [-1, -1, -1, 0, 1, 1, 1, 0];

        for (let k = 0; k < 8; k++) {
          const iFlash = iMask[k] + i;
          const jFlash = jMask[k] + j;
          // check the bounds
          if (jFlash >= 0 &&  jFlash < octoArr.length && iFlash >= 0 && iFlash < octoArr[j].length) {
            octoArr[jFlash][iFlash].power += 1;
          }
        }
      }
    }
  }
  if (totalFlashes > 0) {
    return totalFlashes + simulateFlashes(octoArr);
  }

  return totalFlashes;
};

// Reset power to 0 if power > 9 and reset flashed state
const postFlash = octoArr => {
  for (let i = 0; i < octoArr.length; i++) {
    for (let j = 0; j < octoArr[i].length; j++) {
      const octo = octoArr[j][i];
      octo.flashed = false;
      if (octo.power > 9) {
        octo.power = 0;
      }
    }
  }
}

const printOctoArr = octoArr => {
  octoArr.forEach(row => {
    console.log(row.map(octo => octo.power).join(''));
  });
}

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  /*
    interface Octopus {
      flashed: boolean
      power: number // 0 to 9
    }
   */
  const octoArr = input.split('\n')
    .map(line =>
      line.split('').map(power => ({ flashed: false, power: +power }))
    );

  let totalFlashes = 0;
  for (let i = 0; i < 100; i++) {
    // increase energy by 1 for all
    increasePower(octoArr);

    totalFlashes += simulateFlashes(octoArr);

    // Reset power to 0 if power > 9 and reset flashed state
    postFlash(octoArr);

    // if (i === 1) {
    //   printOctoArr(octoArr);
    // }
  }

  console.log('flashes:', totalFlashes);
}
