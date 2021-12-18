// https://adventofcode.com/2021/day/10#part2

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
      const last = stack[stack.length - 1];
      if (last === '(' && token !== ')') {
        return [last, stack];
      }
      if (last === '[' && token !== ']') {
        return [last, stack];
      }
      if (last === '{' && token !== '}') {
        return [last, stack];
      }
      if (last === '<' && token !== '>') {
        return [last, stack];
      }
      stack.pop();
    }
  }
  return [null, stack];
}

function run(input) {
  let lines = input.split('\n');

  // Filter out error lines
  // lines = lines.filter(line => findError(line.split(''))[0] === null);

  const points = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  };
  const closing = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
  }

  let scores = [];
  for (let i = 0; i < lines.length; i++) {
    const [errorToken, stack] = findError(lines[i].split(''));
    if (errorToken || stack.length === 0) {
      continue;
    }
    let autocompleteScore = 0;
    stack.reverse().forEach(token => {
      autocompleteScore = autocompleteScore*5 + points[closing[token]];
    });
    scores.push(autocompleteScore);
  }
  scores.sort((s1, s2) => s1 - s2);
  console.log('scores:', scores);

  console.log('autocomplete score:', scores[Math.floor(scores.length / 2)]);
}
