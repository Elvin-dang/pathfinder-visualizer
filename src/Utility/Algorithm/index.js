import { dijkstra } from "./dijkstra";
import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { aStar } from "./aStar";

function getNodesInShortestPath(finishNode) {
  const nodes = [];
  let currentNode = finishNode;
  while (currentNode) {
    nodes.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodes;
}

export { dijkstra, bfs, dfs, aStar, getNodesInShortestPath };
