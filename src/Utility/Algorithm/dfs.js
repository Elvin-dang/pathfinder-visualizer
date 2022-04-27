export function dfs(grid, startNode, finishNode) {
  refreshGrid(grid);
  const visitedNodes = [];
  const exploredNodes = [startNode]; // as a queue
  while (exploredNodes.length > 0) {
    const currentNode = exploredNodes.pop();
    // Check wall
    if (currentNode.isWall) continue;
    if (!currentNode.isVisited) {
      currentNode.isVisited = true;
      visitedNodes.push(currentNode);
      // Compare "address" of 2 objects. It mean visited node has reached to the destination
      if (currentNode === finishNode) return visitedNodes;
      const neighbors = getUnVisitedNeighborsOfCurrentNode(currentNode, grid);
      for (const neighbor of neighbors) {
        neighbor.previousNode = currentNode;
        exploredNodes.push(neighbor);
      }
    }
  }
  return visitedNodes;
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

function refreshGrid(grid) {
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.isVisited = false;
      node.previousNode = null;
    }
  }
}
