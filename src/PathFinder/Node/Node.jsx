import React, { useRef } from "react";
import "./Node.css";

const Node = (props) => {
  const { node } = props;
  const ref = useRef(null);
  node.ref = ref;

  const getNodeClass = () => {
    if (node.isStartNode) return "node node-start";
    if (node.isFinishNode) return "node node-finish";
    if (node.isWall) return "node node-wall";
    return "node";
  };

  return (
    <div id={`${node.row}-${node.col}`} ref={ref} className={getNodeClass()} />
  );
};

export default Node;
