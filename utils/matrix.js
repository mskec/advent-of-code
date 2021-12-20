
function createMatrix(rows, cols, initialValue) {
  return Array(rows).fill(0).map(() => Array(cols).fill(initialValue));
}

function createMatrixXYZ(x, y, z, initialValue) {
  return Array(z).fill(0)
    .map(() => Array(y).fill(0)
      .map(() => Array(x).fill(initialValue))
    );
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

module.exports = {
  createMatrix,
  createMatrixXYZ,
  countMatrixValues,
  copyMatrix,
};