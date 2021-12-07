// https://adventofcode.com/2021/day/4#part2

// draw a number
// for each board
//   skip if board won
//   mark num if on a board as drawn
//   check if it's a winner
//     mark board as won
//

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
    interface Board {
      didWin: boolean
      rows: Line[]
      columns: Line[]
    }
    interface Line {
      [num: string]: boolean
    }
   */
  const boards = [];
  for (let i = 0; i < boardsInput.length; i += 6) {
    const board = {
      didWin: false,
      rows: [{}, {}, {}, {}, {}],
      columns: [{}, {}, {}, {}, {}],
    };
    const convertToBoard = (line, rowIdx) => {
      const nums = line.trim().split(/\s+/);
      nums.forEach((num, idx) => {
        board.rows[rowIdx][num] = false;
        board.columns[idx][num] = false;
      });
    };

    convertToBoard(boardsInput[i], 0);
    convertToBoard(boardsInput[i + 1], 1);
    convertToBoard(boardsInput[i + 2], 2);
    convertToBoard(boardsInput[i + 3], 3);
    convertToBoard(boardsInput[i + 4], 4);

    boards.push(board);
  }

  // Board
  let drawnNum = null;
  let winner = null;
  let winners = 0;

  for (let i = 0; i < numbers.length && winners < boards.length; i++) {
    drawnNum = numbers[i];

    boards.forEach(board => {
      if (board.didWin) {
        return;
      }

      const processNum = line => {
        if (typeof line[drawnNum] === 'boolean') {
          // mark as drawn
          line[drawnNum] = true;
          // check if it's a winner
          if (Object.keys(line).every(num => line[num])) {
            winner = board;
            board.didWin = true;
            winners++;
          }
        }
      };

      board.rows.forEach(processNum);
      if (board.didWin) {
        return;
      }
      board.columns.forEach(processNum);
    });
  }

  const unmarkedNums = [];
  winner.rows.forEach(line => {
    Object.keys(line).forEach(num => {
      if (!line[num]) {
        unmarkedNums.push(num);
      }
    });
  });

  const unmarkedSum = unmarkedNums.reduce((agg, num) => agg + +num, 0);
  const result = unmarkedSum * +drawnNum;

  console.log('winner:', winner);
  console.log('last drawn:', drawnNum);
  console.log('result:', result);
}
