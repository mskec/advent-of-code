// https://adventofcode.com/2021/day/14#part2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const [startingTemplate, , ...pairsInput] = input.split('\n');

  const pairInsertions = {};
  pairsInput.forEach(pairInput => {
    const [pair, result] = pairInput.split(' -> ');
    pairInsertions[pair] = result;
  });

  let template = startingTemplate.split('');
  let letterCnts = {};
  let pairCnts = {};

  for (let i = 0; i < template.length - 1; i++) {
    const pair = `${template[i]}${template[i+1]}`;
    if (!pairCnts[pair]) {
      pairCnts[pair] = 0;
    }
    if (!letterCnts[pair[0]]) {
      letterCnts[pair[0]] = 0;
    }
    if (!letterCnts[pair[1]]) {
      letterCnts[pair[1]] = 0;
    }
    pairCnts[pair]++;
    letterCnts[pair[0]]++;
  }
  letterCnts[template[template.length - 1]]++;

  console.log(pairCnts);
  console.log(letterCnts);

  for (let k = 0; k < 40; k++) {
    let newLetterCnts = { ...letterCnts };
    let newPairCnts = { };

    Object.keys(pairCnts)
      .forEach(pair => {
        const pairCnt = pairCnts[pair];
        const added = pairInsertions[pair];
        [`${pair[0]}${added}`, `${added}${pair[1]}`].forEach(newPair => {
          if (!newPairCnts[newPair]) {
            newPairCnts[newPair] = 0;
          }
          if (!newLetterCnts[newPair[0]]) {
            newLetterCnts[newPair[0]] = 0;
          }
          if (!newLetterCnts[newPair[1]]) {
            newLetterCnts[newPair[1]] = 0;
          }
          newPairCnts[newPair] += pairCnt;
        });
        newLetterCnts[added] += pairCnt;
      });

    pairCnts = newPairCnts;
    letterCnts = newLetterCnts;
  }

  const sorted = Object.entries(letterCnts);
  sorted.sort((p1, p2) => p1[1] - p2[1]);
  console.log(sorted);

  const diff = sorted[sorted.length-1][1] - sorted[0][1];
  console.log('diff:', diff);
}
