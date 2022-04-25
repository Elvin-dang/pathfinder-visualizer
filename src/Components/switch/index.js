import React from "react";
import "./style.css";

const Switch = ({ onChange, defaultCheck = false }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        onChange={onChange}
        defaultChecked={defaultCheck}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;
