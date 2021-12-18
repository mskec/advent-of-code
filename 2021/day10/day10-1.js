// https://adventofcode.com/2021/day/10

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function findError(tokens) {
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (['(', '[', '{', '<'].includes(token)) {
      stack.push(token);
    } else {
      const last = stack.pop();
      if (last === '(' && token !== ')') {
        return token;
      }
      if (last === '[' && token !== ']') {
        return token;
      }
      if (last === '{' && token !== '}') {
        return token;
      }
      if (last === '<' && token !== '>') {
        return token;
      }
    }
  }
}

function run(input) {
  const lines = input.split('\n');

  const points = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  };

  let errorScore = 0;
  for (let i = 0; i < lines.length; i++) {
    const error = findError(lines[i].split(''));
    if (error) {
      errorScore += points[error];
    }
  }

  console.log('Error score:', errorScore);
}
