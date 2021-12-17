// https://adventofcode.com/2021/day/14

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
  for (let k = 0; k < 10; k++) {
    // console.log(k, template.join(''));
    let nextTemplate = [];
    for (let i = 0; i < template.length - 1; i++) {
      nextTemplate.push(template[i]);
      nextTemplate.push(pairInsertions[`${template[i]}${template[i+1]}`]);
    }
    nextTemplate.push(template[template.length - 1]);
    template = nextTemplate;
  }

  let cnts = {};
  for (let i = 0; i < template.length; i++) {
    if (!cnts[template[i]]) {
      cnts[template[i]] = 0;
    }
    cnts[template[i]]++;
  }

  const sorted = Object.entries(cnts);
  sorted.sort((p1, p2) => p1[1] - p2[1]);
  console.log(sorted);

  const diff = sorted[sorted.length-1][1] - sorted[0][1];
  console.log('diff:', diff);
}
