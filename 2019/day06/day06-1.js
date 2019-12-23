// https://adventofcode.com/2019/day/6

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const orbitEntries = input.split('\n').map(o => o.split(')'));

  const orbitsById = orbitEntries.reduce((byId, entry) => {
    if (!byId[entry[0]]) {
      byId[entry[0]] = {
        id: entry[0],
        orbitedBy: [],
        orbits: null,
      };
    }

    if (!byId[entry[1]]) {
      byId[entry[1]] = {
        id: entry[1],
        orbitedBy: [],
        orbits: entry[0],
      };
    } else {
      byId[entry[1]].orbits = entry[0];
    }

    byId[entry[0]].orbitedBy.push(byId[entry[1]]);
    return byId;
  }, {});

  const root = Object.values(orbitsById).find(obj => !obj.orbits);
  console.log('Total orbits', countOrbits(root, 0)); // 234446
};

function countOrbits(node, depth) {
  if (!node) {
    return 0;
  }

  let orbitedByOrbits = depth;
  node.orbitedBy.forEach(obj => {
    orbitedByOrbits += countOrbits(obj, depth + 1);
  });
  return orbitedByOrbits;
}
