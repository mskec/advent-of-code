// https://adventofcode.com/2021/day/12#part2

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);


function canVisit(node, visited, nodes, smallCave) {
  const timesVisited = visited.filter(n => n === node.name).length;
  return node.isBig ||
    (!node.isBig && timesVisited === 0) ||
    (!node.isBig && timesVisited === 1 && node.name === smallCave);
}

function findPaths(node, visited, nodes, smallCave) {
  if (!node) {
    return [];
  }
  // console.log('findPaths', node.name, visited);
  if (!canVisit(node, visited, nodes, smallCave)) {
    // console.log('< visited and small');
    return [];
  }

  if (node.name === 'end') {
    // console.log('< end');
    return [];
  }

  const paths = [];
  visited.push(node.name);

  node.connections.forEach(connectedNode => {
    if (!canVisit(connectedNode, visited, nodes, smallCave)) {
      return;
    }

    const result = findPaths(connectedNode, [...visited], nodes, smallCave);
    // console.log('> result', result);

    if (result.length > 0) {
      paths.push(...result.map(r => ([node.name, ...r])));
    } else {
      paths.push([node.name, connectedNode.name]);
    }
  });

  // console.log();
  return paths;
}

/*
  interface Node {
    isBig: boolean
    connections: Node[]
  }
 */
function run(input) {
  const nodes = {};
  input.split('\n').forEach(line => {
    const [from, to] = line.split('-');
    if (!nodes[from]) {
      nodes[from] = {
        name: from,
        isBig: from === from.toUpperCase(),
        connections: [],
      };
    }
    if (!nodes[to]) {
      nodes[to] = {
        name: to,
        isBig: to === to.toUpperCase(),
        connections: [],
      };
    }
    nodes[from].connections.push(nodes[to]);
    nodes[to].connections.push(nodes[from]);
  });

  // find all small caves
  const smallCaves = Object.values(nodes)
    .filter(node => !node.isBig && !['start', 'end'].includes(node.name))
    .map(node => node.name);

  console.log(smallCaves);

  let paths = [];
  for (let i = 0; i < smallCaves.length; i++) {
    paths.push(...findPaths(nodes.start, [], nodes, smallCaves[i]));
  }

  // filter-out incomplete paths
  const uniquePaths = {};
  paths = paths
    .filter(path => path[0] === 'start' && path[path.length - 1] === 'end')
    .filter(path => {
      const pathKey = path.join('');
      if (!uniquePaths[pathKey]) {
        uniquePaths[pathKey] = true;
        return true;
      }
      return false;
    });

  console.log('paths:', paths.length);
}
