function findLCM(a, b) {
  return a * b / findGCF(a, b);
}

function findGCF(n1, n2) {
  const factors1 = findFactors(n1);
  const factors2 = findFactors(n2);
  const common = {};
  factors1.forEach(f => { common[f] = true; });
  for (let i = factors2.length - 1; i >= 0; i--) {
    if (common[factors2[i]]) {
      return factors2[i];
    }
  }
  return 1;
}

function findFactors(num) {
  const factors = [1, num];
  let highest = num;

  for (let i = 2; i <= num && i < highest; i++) {
    const div = num / i;
    if (Number.isInteger(div)) {
      factors.push(i);
      if (i !== div) {
        factors.push(div);
      }
      highest = div;
    }
  }

  factors.sort((n1, n2) => n1 - n2);
  return factors;
}

module.exports = {
  findLCM,
  findLCMBrute,
};
