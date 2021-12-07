// https://adventofcode.com/2021/day/4

// Note: the algorithm is wrong because it checks for rows only. It doesn't check columns.

// draw a number
// for each board
//   mark as drawn
//   check if it's a winner

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const [numbersInput, , ...boardsInput] = input.split('\n');

  const numbers = numbersInput.split(',');

  /*
    type Boards = Board[];
    type Board = Line[];
    interface Line {
      [num: string]: boolean
    }
   */
  const boards = [];
  for (let i = 0; i < boardsInput.length; i += 6) {
    const convertToBoard = line => {
      // console.log('convertToBoard', line.trim().split(/\s+/));
      return line.trim().split(/\s+/).reduce((agg, n) => {
        agg[n] = false;
        return agg;
      }, {});
    }

    const board = [
      convertToBoard(boardsInput[i]),
      convertToBoard(boardsInput[i + 1]),
      convertToBoard(boardsInput[i + 2]),
      convertToBoard(boardsInput[i + 3]),
      convertToBoard(boardsInput[i + 4]),
    ];
    boards.push(board);
  }

  // Board
  let drawnNum = null;
  let winner = null;
  for (let i = 0; i < numbers.length && winner === null; i++) {
    drawnNum = numbers[i];

    boards.forEach(board => {
      board.forEach(line => {
        if (typeof line[drawnNum] === 'boolean') {
          // mark as drawn
          line[drawnNum] = true;
          // check if it's a winner
          if (Object.keys(line).every(num => line[num])) {
            winner = board;
          }
        }
      });
    });
  }

  const unmarkedNums = [];
  winner.forEach(line => {
    Object.keys(line).forEach(num => {
      if (!line[num]) {
        unmarkedNums.push(num);
      }
    });
  });

  const unmarkedSum = unmarkedNums.reduce((agg, num) => agg + +num, 0);
  const result = unmarkedSum * +drawnNum;

  console.log('winner:', winner);
  console.log('result:', result);
}
