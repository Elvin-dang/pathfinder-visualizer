export function aStar(grid, startNode, finishNode) {
  refreshGrid(grid);
  const visitedNodes = [];
  const openSet = new Set([startNode]);
  startNode.g = 0;
  startNode.f = heuristic(startNode, finishNode);
  while (openSet.size) {
    const current = getMin(openSet);
    if (current.isWall) {
      openSet.delete(current);
      continue;
    }
    current.isVisited = true;
    visitedNodes.push(current);
    if (current === finishNode) return visitedNodes;
    openSet.delete(current);
    const neighbors = getUnVisitedNeighborsOfCurrentNode(current, grid);
    for (const neighbor of neighbors) {
      const tempG = current.g + 1; // 1 is distance between two nodes
      if (tempG < neighbor.g) {
        neighbor.previousNode = current;
        neighbor.g = tempG;
        neighbor.f = tempG + heuristic(neighbor, finishNode);
        if (!openSet.has(neighbor)) openSet.add(neighbor);
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

function getMin(set) {
  let min = set.values().next().value;
  for (let element of set) {
    if (element.f < min.f) min = element;
  }
  return min;
}

function heuristic(current, finish) {
  const dx = Math.abs(current.col - finish.col);
  const dy = Math.abs(current.row - finish.row);
  return dx + dy;
}

function refreshGrid(grid) {
  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.isVisited = false;
      node.previousNode = null;
      node.g = Infinity;
      node.f = Infinity;
    }
  }
}
