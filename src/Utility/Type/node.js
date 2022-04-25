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

  clone(modifiedProps) {
    const cloneNode = new Node(
      this.row,
      this.col,
      this.isStartNode,
      this.isFinishNode,
    );
    if (modifiedProps.isWall !== undefined)
      cloneNode.isWall = modifiedProps.isWall;
    else cloneNode.isWall = this.isWall;
    if (modifiedProps.distance !== undefined)
      cloneNode.distance = modifiedProps.distance;
    else cloneNode.distance = this.distance;
    if (modifiedProps.previousNode !== undefined)
      cloneNode.previousNode = modifiedProps.previousNode;
    else cloneNode.previousNode = this.previousNode;
    if (modifiedProps.isVisited !== undefined)
      cloneNode.isVisited = modifiedProps.isVisited;
    else cloneNode.isVisited = this.isVisited;
    if (modifiedProps.ref !== undefined) cloneNode.ref = modifiedProps.ref;
    else cloneNode.ref = this.ref;
    return cloneNode;
  }
}

export default Node;
