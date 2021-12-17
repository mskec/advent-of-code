
function createMatrix(rows, cols, initValue) {
  return Array(rows).fill(0).map(() => Array(cols).fill(initValue));
}

function countMatrixValues(matrix, value) {
  let cnt = 0;
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] === value) {
        cnt++;
      }
    }
  }
  return cnt;
}


module.exports = {
  createMatrix,
  countMatrixValues,
};