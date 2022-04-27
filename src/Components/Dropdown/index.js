import React from "react";
import "./style.css";

const Dropdown = ({ title, contents, onClick, propRef }) => {
  return (
    <div className="dropdown">
      <button ref={propRef} className="drop-btn">
        {title}
        <div className="dropdown-content">
          {contents.map((content) => (
            <div key={Math.random()} onClick={() => onClick(content.value)}>
              {content.name}
            </div>
          ))}
        </div>
      </button>
    </div>
  );
};

export default Dropdown;
