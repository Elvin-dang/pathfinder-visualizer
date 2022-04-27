export function dijkstra(grid, startNode, finishNode) {
  const visitedNodes = [];
  const unVisitedNodes = gridToArray(grid);
  startNode.distance = 0;
  while (unVisitedNodes.length > 0) {
    unVisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unVisitedNodes.shift();
    // Check wall
    if (closestNode.isWall) continue;
    // Check if there no way to find the destiny node (at least, the finish node has Infinity distance)
    if (closestNode.distance === Infinity) return visitedNodes;
    closestNode.isVisited = true;
    visitedNodes.push(closestNode);
    // Compare "address" of 2 objects. It mean visited node has reached to the destination
    if (closestNode === finishNode) return visitedNodes;
    updateUnVisitedNeighbors(closestNode, grid);
  }
}

function updateUnVisitedNeighbors(node, grid) {
  const neighbors = getUnVisitedNeighborsOfCurrentNode(node, grid);
  for (const neighbor of neighbors) {
    const alt = node.distance + 1; // 1 is the edges value between node & its neighbor
    if (alt < neighbor.distance) {
      neighbor.distance = alt;
      neighbor.previousNode = node;
    }
  }
}

function getUnVisitedNeighborsOfCurrentNode(node, grid) {
  const { col, row } = node;
  const neighbors = [];
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((node) => !node.isVisited);
}

function gridToArray(grid) {
  const array = [];
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.isVisited = false;
      node.previousNode = null;
      array.push(node);
    }
  }
  return array;
}
