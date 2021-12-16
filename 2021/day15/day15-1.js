// https://adventofcode.com/2021/day/15

const path = require('path');
const fs = require('fs');

run(
  fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8').trim()
);

function run(input) {
  const map = input.split('\n').map(row => row.split('').map(v => +v));
  const yLen = map.length
  const xLen = map[yLen - 1].length;
  /*
    interface Node {
      cost: number
      distance: number
      adjacentNodes: Node[]
    }
   */
  const nodes = {};
  const getNode = (x, y) => nodes[`${x},${y}`];
  const getKey = node => `${node.x},${node.y}`;
  const sortByDistance = (n1, n2) => n1.distance - n2.distance;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const node = {
        x,
        y,
        cost: map[y][x],
        distance: Number.MAX_VALUE,
        adjacentNodes: [],
      }
      nodes[`${x},${y}`] = node;
      if (x > 0) {
        const leftNode = getNode(x-1, y);
        node.adjacentNodes.push(leftNode);
        leftNode.adjacentNodes.push(node);
      }
      if (y > 0) {
        const topNode = getNode(x, y-1);
        node.adjacentNodes.push(topNode);
        topNode.adjacentNodes.push(node);
      }
    }
  }

  // Dijkstra’s shortest path algorithm
  const startNode = getNode(0, 0);
  startNode.distance = 0;
  const endNodeKey = `${xLen-1},${yLen-1}`;

  const unvisited = Object.values(nodes);
  unvisited.sort(sortByDistance);

  const sptNodes = {};
  while (!sptNodes[endNodeKey]) {
    const closest = unvisited.shift();
    sptNodes[getKey(closest)] = true;
    closest.adjacentNodes.forEach(node => {
      // if the node is in the spt Set => skip adjusting it's cost
      if (sptNodes[getKey(node)]) {
        return;
      }

      // adjust node cost
      const distance = closest.distance + node.cost;
      if (distance < node.distance) {
        node.distance = distance;
      }
    });

    // sort again - this is slow for large data set
    unvisited.sort(sortByDistance);
  }

  console.log('cost:', nodes[endNodeKey].distance);
}
