import React, { useEffect, useRef, useState } from "react";
import Node from "../Utility/Class/node";
import NodeComponent from "./Node/Node";
import {
  dijkstra,
  bfs,
  dfs,
  aStar,
  getNodesInShortestPath,
} from "../Utility/Algorithm";
import {
  recursiveDivision,
  chooseOrientation,
  surroundingWall,
} from "../Utility/MazeGenerationAlgorithm";
import { Dropdown, Switch } from "../Components";
import "./PathFinder.css";

const DEFAULT_START_NODE_ROW = 10;
const DEFAULT_START_NODE_COL = 10;
const DEFAULT_FINISH_NODE_ROW = 10;
const DEFAULT_FINISH_NODE_COL = 40;
const DEFAULT_ROW = 20;
const DEFAULT_COL = 50;

const PathFinder = () => {
  const [grid, setGrid] = useState([]);
  const [wallToggle, setWallToggle] = useState(false);
  const [startNodeToggle, setStartNodeToggle] = useState(false);
  const [finishNodeToggle, setFinishNodeToggle] = useState(false);
  const [algorithm, setAlgorithm] = useState("Dijkstra");
  const [speed, setSpeed] = useState(-10);

  const wallRef = useRef(null);
  const startNodeRef = useRef(null);
  const finishNodeRef = useRef(null);
  const visualizeBtnRef = useRef(null);
  const dropdownBtnRef = useRef(null);
  const clearBtnRef = useRef(null);
  const speedInputRef = useRef(null);
  const mazeBtnRef = useRef(null);
  const number = useRef(null);
  const length = useRef(null);

  useEffect(() => {
    setGrid(createDefaultNewGrid());
  }, []);

  const createDefaultNewGrid = () => {
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

  const createNewGrid = () => {
    let { startNode, finishNode } = getStartAndFinishNode();
    const newGrid = [];
    for (let i = 0; i < DEFAULT_ROW; i++) {
      const newRow = [];
      for (let j = 0; j < DEFAULT_COL; j++) {
        newRow.push(
          new Node(
            i,
            j,
            i === startNode.row && j === startNode.col,
            i === finishNode.row && j === finishNode.col,
          ),
        );
      }
      newGrid.push(newRow);
    }
    return newGrid;
  };

  const setWall = (node) => {
    if (!node.isStartNode && !node.isFinishNode) {
      const newWallNode = node.clone({ isWall: !node.isWall });
      grid[node.row][node.col] = newWallNode;
      const newGrid = grid.map((row) => row.slice());
      setGrid(newGrid);
    }
  };

  const setStartNode = (node) => {
    if (!node.isStartNode && !node.isFinishNode) {
      grid.forEach((row) => {
        const oldStartNode = row.find((node) => node.isStartNode);
        if (oldStartNode) oldStartNode.isStartNode = false;
      });
      const newStartNode = node.clone({ isStartNode: true, isWall: false });
      grid[node.row][node.col] = newStartNode;
      const newGrid = grid.map((row) => row.slice());
      setGrid(newGrid);
    }
  };

  const setFinishNode = (node) => {
    if (!node.isFinishNode && !node.isStartNode) {
      grid.forEach((row) => {
        const oldFinishNode = row.find((node) => node.isFinishNode);
        if (oldFinishNode) oldFinishNode.isFinishNode = false;
      });
      const newFinishNode = node.clone({ isFinishNode: true, isWall: false });
      grid[node.row][node.col] = newFinishNode;
      const newGrid = grid.map((row) => row.slice());
      setGrid(newGrid);
    }
  };

  const handleClickNode = (node) => {
    if (startNodeToggle) setStartNode(node);
    else if (finishNodeToggle) setFinishNode(node);
    else if (wallToggle) setWall(node);
    else return;
  };

  const toggle = (field, value) => {
    setWallToggle(false);
    setStartNodeToggle(false);
    setFinishNodeToggle(false);
    switch (field) {
      case "wall":
        setWallToggle(value);
        break;
      case "start":
        setStartNodeToggle(value);
        break;
      case "finish":
        setFinishNodeToggle(value);
        break;
      default:
        break;
    }
  };

  const disable = (value) => {
    wallRef.current.disabled = value;
    startNodeRef.current.disabled = value;
    finishNodeRef.current.disabled = value;
    visualizeBtnRef.current.disabled = value;
    dropdownBtnRef.current.disabled = value;
    mazeBtnRef.current.disabled = value;
    clearBtnRef.current.disabled = value;
    speedInputRef.current.disabled = value;
  };

  const resetStatistic = () => {
    number.current.innerHTML = 0;
    length.current.innerHTML = 0;
  };

  const getStartAndFinishNode = () => {
    let startNode, finishNode;
    for (const row of grid) {
      startNode = row.find((node) => node.isStartNode);
      if (startNode) break;
    }
    for (const row of grid) {
      finishNode = row.find((node) => node.isFinishNode);
      if (finishNode) break;
    }
    return { startNode, finishNode };
  };

  const animateVisitedNodes = (visitedNodes, nodesInShortestPath) => {
    toggle("none");
    disable(true);
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPath);
        }, Math.abs(speed) * i);
        return;
      }
      if (!visitedNodes[i].isStartNode && !visitedNodes[i].isFinishNode)
        setTimeout(() => {
          const node = visitedNodes[i];
          node.ref.current.className = "node node-visited";
          number.current.innerHTML = Number(number.current.innerHTML) + 1;
        }, Math.abs(speed) * i);
      else {
        setTimeout(() => {
          number.current.innerHTML = Number(number.current.innerHTML) + 1;
        }, Math.abs(speed) * i);
      }
    }
  };

  const animateShortestPath = (nodesInShortestPath) => {
    for (let i = 0; i < nodesInShortestPath.length; i++) {
      if (
        !nodesInShortestPath[i].isStartNode &&
        !nodesInShortestPath[i].isFinishNode
      )
        setTimeout(() => {
          const node = nodesInShortestPath[i];
          node.ref.current.className = "node node-shortest-path";
          length.current.innerHTML = Number(length.current.innerHTML) + 1;
        }, 5 * Math.abs(speed) * i);
      if (nodesInShortestPath[i].isFinishNode) {
        setTimeout(() => {
          length.current.innerHTML = Number(length.current.innerHTML) + 1;
          disable(false);
        }, 5 * Math.abs(speed) * i);
      }
      if (nodesInShortestPath[i].isStartNode) {
        setTimeout(() => {
          length.current.innerHTML = Number(length.current.innerHTML) + 1;
        }, 5 * Math.abs(speed) * i);
      }
    }
  };

  const animationMaze = (wallNodes, newGrid) => {
    for (let i = 0; i <= wallNodes.length; i++) {
      if (i === wallNodes.length) {
        setTimeout(() => {
          setGrid(newGrid);
          disable(false);
        }, 2 * Math.abs(speed) * i + 1500);
      } else {
        setTimeout(() => {
          document
            .getElementById(`${wallNodes[i].row}-${wallNodes[i].col}`)
            .classList.add("animation-trigger");
        }, 2 * Math.abs(speed) * i);
      }
    }
  };

  const drawMaze = () => {
    toggle("none");
    disable(true);
    resetStatistic();
    const wallNodes = [];
    const newGrid = createNewGrid();
    setGrid(createNewGrid());
    surroundingWall(newGrid, wallNodes);
    recursiveDivision(
      newGrid,
      1,
      1,
      DEFAULT_COL - 2,
      DEFAULT_ROW - 2,
      chooseOrientation(DEFAULT_COL, DEFAULT_ROW),
      wallNodes,
      0,
    );
    animationMaze(wallNodes, newGrid);
  };

  const visualize = () => {
    setGrid(grid.map((row) => row.slice()));
    resetStatistic();
    let { startNode, finishNode } = getStartAndFinishNode();
    let visitedNodes;
    switch (algorithm) {
      case "Dijkstra":
        visitedNodes = dijkstra(grid, startNode, finishNode);
        break;
      case "BFS":
        visitedNodes = bfs(grid, startNode, finishNode);
        break;
      case "DFS":
        visitedNodes = dfs(grid, startNode, finishNode);
        break;
      case "A*":
        visitedNodes = aStar(grid, startNode, finishNode);
        break;
      default:
        break;
    }
    const nodesInShortestPath = getNodesInShortestPath(finishNode);
    animateVisitedNodes(visitedNodes, nodesInShortestPath);
  };

  return (
    <div>
      <div className="menu">
        <div className="func-btn">
          <button id="maze-btn" onClick={() => drawMaze()} ref={mazeBtnRef}>
            Generate maze
          </button>
          <button
            onClick={() => {
              setGrid(createNewGrid());
              resetStatistic();
            }}
            id="clear-btn"
            ref={clearBtnRef}
          >
            Clear
          </button>
        </div>
        <div className="combo-btn">
          <button
            onClick={() => visualize()}
            id="visualize-btn"
            ref={visualizeBtnRef}
          >
            Visualize {algorithm}
          </button>
          <Dropdown
            title={"▼"}
            contents={[
              { name: "Dijkstra", value: "Dijkstra" },
              { name: "Breadth-first Search", value: "BFS" },
              { name: "Depth-first Search", value: "DFS" },
              { name: "A Star", value: "A*" },
            ]}
            onClick={(value) => setAlgorithm(value)}
            propRef={dropdownBtnRef}
          />
        </div>
        <div className="modifier">
          <div className="modifier-title">Click to set</div>
          <div className="switch-item-wrapper">
            <span className="node-name">Wall node</span>
            <div id="wall-node" className="node-icon"></div>
            <Switch
              onChange={(e) => toggle("wall", e.target.checked)}
              checked={wallToggle}
              propRef={wallRef}
            />
          </div>
          <div className="switch-item-wrapper">
            <span className="node-name">Start node</span>
            <div id="start-node" className="node-icon"></div>
            <Switch
              onChange={(e) => toggle("start", e.target.checked)}
              checked={startNodeToggle}
              propRef={startNodeRef}
            />
          </div>
          <div className="switch-item-wrapper">
            <span className="node-name">Finish node</span>
            <div id="finish-node" className="node-icon"></div>
            <Switch
              onChange={(e) => toggle("finish", e.target.checked)}
              checked={finishNodeToggle}
              propRef={finishNodeRef}
            />
          </div>
        </div>
        <div className="speed-statistic-wrapper">
          <div className="speed-wrapper">
            <div className="speed-title">
              Speed{" "}
              <span className="speed-title-number">
                x{(10 / Math.abs(speed)).toFixed(1)}
              </span>
            </div>
            <input
              className="speed-slider"
              type="range"
              min={-20}
              max={-5}
              value={speed}
              step={1}
              ref={speedInputRef}
              onChange={(e) => {
                setSpeed(e.target.value);
              }}
            />
          </div>
          <div className="statistic-wrapper">
            <div id="numberVisitedNode">
              Visited node(s): <span ref={number}>0</span>
            </div>
            <div id="shortedPathLength">
              Shortest path length: <span ref={length}>0</span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid">
        {grid.map((row, rowInx) => (
          <div key={Math.random()} id={rowInx} className="row">
            {row.map((node) => (
              <NodeComponent
                key={Math.random()}
                node={node}
                clickable={wallToggle || startNodeToggle || finishNodeToggle}
                onClick={() => handleClickNode(node)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PathFinder;
