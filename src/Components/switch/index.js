import React from "react";
import "./style.css";

const Switch = ({ onChange, checked, disabled, propRef }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        ref={propRef}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;
