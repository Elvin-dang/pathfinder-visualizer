class Node {
  constructor(row, col, isStartNode, isFinishNode) {
    this.row = row;
    this.col = col;
    this.isStartNode = isStartNode;
    this.isFinishNode = isFinishNode;
    this.isWall = false;
    this.distance = Infinity;
    this.previousNode = null;
    this.isVisited = false;
    this.ref = null;
  }
}

export default Node;
