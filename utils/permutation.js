const swap = (str, i, j) => {
  if (i > j) {
    const tmp = j;
    j = i;
    i = tmp;
  }
  if (i === j) {
    return str;
  }

  return str.slice(0, i) + str.charAt(j) + str.slice(i + 1, j) + str.charAt(i) + str.slice(j + 1);
};

function permutation(perms, str, l, r) {
  if (l === r) {
    perms.push(str);
  } else {
    for (let i = l; i <= r; i++) {
      str = swap(str, i, l);
      permutation(perms, str, l + 1, r);
      str = swap(str, i, l);
    }
  }
}

/**
 * Creates a list of all unique permutations for the give str.
 */
function permutations(str) {
  const results = [];
  permutation(results, str, 0, str.length - 1);
  const unique = {};
  results.forEach(r => unique[r] = true);
  return Object.keys(unique);
}

module.exports = permutations;
