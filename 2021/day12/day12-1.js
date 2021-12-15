// https://adventofcode.com/2021/day/12

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);


function findPaths(node, visited, nodes) {
  if (!node) {
    return [];
  }
  const isVisited = visited.indexOf(node.name) !== -1;
  // console.log('findPaths', node.name, visited);
  if (isVisited && !node.isBig) {
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
    const isVisited = visited.indexOf(connectedNode.name) !== -1;
    if (isVisited && !connectedNode.isBig) {
      return;
    }

    const result = findPaths(connectedNode, [...visited], nodes);
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

  let paths = findPaths(nodes.start, [], nodes);
  paths = paths.filter(path => path[0] === 'start' && path[path.length - 1] === 'end');
  // console.log(paths);
  console.log('paths:', paths.length);
}
