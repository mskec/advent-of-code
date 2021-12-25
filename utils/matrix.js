
function createMatrix(rows, cols, initialValue) {
  return Array(rows).fill(0).map(() => Array(cols).fill(initialValue));
}

function createMatrixXYZ(x, y, z, initialValue) {
  return Array(z).fill(0).map(() => createMatrix(y, x, initialValue));
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

function copyMatrix(matrix) {
  const newMatrix = [];
  for (let i = 0; i < matrix.length; i++) {
    if (Array.isArray(matrix[i])) {
      newMatrix[i] = copyMatrix(matrix[i]);
    }
    newMatrix[i] = matrix[i];
  }
  return newMatrix;
}

function printMatrix(matrix) {
  console.log(matrix.map(row => row.join('')).join('\n'));
}

module.exports = {
  createMatrix,
  createMatrixXYZ,
  countMatrixValues,
  copyMatrix,
  printMatrix,
};