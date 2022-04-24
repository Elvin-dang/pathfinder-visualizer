import React, { useEffect, useState } from "react";
import Node from "../Utility/Type/node";
import NodeComponent from "./Node/Node";
import { dijkstra, getNodesInShortestPath } from "../Utility/Algorithm";
import "./PathFinder.css";

const DEFAULT_START_NODE_ROW = 10;
const DEFAULT_START_NODE_COL = 10;
const DEFAULT_FINISH_NODE_ROW = 12;
const DEFAULT_FINISH_NODE_COL = 20;
const DEFAULT_ROW = 20;
const DEFAULT_COL = 50;

const PathFinder = () => {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    setGrid(createNewGrid());
  }, []);

  const createNewGrid = () => {
    const newGrid = [];
    for (let i = 0; i < DEFAULT_ROW; i++) {
      const newRow = [];
      for (let j = 0; j < DEFAULT_COL; j++) {
        newRow.push(
          new Node(
            i,
            j,
            i === DEFAULT_START_NODE_ROW && j === DEFAULT_START_NODE_COL,
            i === DEFAULT_FINISH_NODE_ROW && j === DEFAULT_FINISH_NODE_COL,
          ),
        );
      }
      newGrid.push(newRow);
    }
    return newGrid;
  };

  const animateDijkstra = (visitedNodes, nodesInShortestPath) => {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPath);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        node.ref.current.className = "node node-visited";
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPath) => {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPath[i];
        node.ref.current.className = "node node-shortest-path";
      }, 50 * i);
    }
  };

  const visualize = () => {
    const visitedNodes = dijkstra(
      grid,
      grid[DEFAULT_START_NODE_ROW][DEFAULT_START_NODE_COL],
      grid[DEFAULT_FINISH_NODE_ROW][DEFAULT_FINISH_NODE_COL],
    );
    const nodesInShortestPath = getNodesInShortestPath(
      grid[DEFAULT_FINISH_NODE_ROW][DEFAULT_FINISH_NODE_COL],
    );
    animateDijkstra(visitedNodes, nodesInShortestPath);
  };

  return (
    <div>
      <div className="menu">
        <button onClick={() => visualize()}>Visualize</button>
        <button
          onClick={() => {
            setGrid(createNewGrid());
          }}
        >
          Clear
        </button>
      </div>
      <div className="grid">
        {grid.map((row, rowInx) => (
          <div key={Math.random()} id={rowInx} className="row">
            {row.map((node) => (
              <NodeComponent key={Math.random()} node={node} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathFinder;
