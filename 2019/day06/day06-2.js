// https://adventofcode.com/2019/day/6#part2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const orbitEntries = input.split('\n').map(o => o.split(')'));

  let objYou;
  let objSanta;
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
        orbits: null,
      };
    }
    byId[entry[1]].orbits = byId[entry[0]];

    if (entry[1] === 'YOU') {
      objYou = byId[entry[1]];
    } else if (entry[1] === 'SAN') {
      objSanta = byId[entry[1]];
    }

    byId[entry[0]].orbitedBy.push(byId[entry[1]]);
    return byId;
  }, {});

  const commonObj = findCommon(objYou, objSanta);
  const orbitsYou = countOrbits(objYou);
  const orbitsSanta = countOrbits(objSanta);
  const orbitsCommon = countOrbits(commonObj);

  console.log('Total orbit transfers', orbitsYou + orbitsSanta - 2 * orbitsCommon - 2);
};

// Returns a common node between obj1 and obj2
function findCommon(obj1, obj2) {
  const objById = {};

  let node = obj1.orbits;
  // Find all parents for obj1
  while (node !== null) {
    objById[node.id] = true;
    node = node.orbits;
  }

  node = obj2.orbits;
  while (node !== null) {
    if (objById[node.id]) {
      return node;
    }
    node = node.orbits;
  }
  return null;
}

// Calculates total orbits to the root
function countOrbits(node) {
  if (!node) {
    return 0;
  }

  let totalOrbits = 0;
  while (node !== null) {
    totalOrbits += 1;
    node = node.orbits;
  }
  return totalOrbits;
}
