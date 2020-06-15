import React from "react";

const style={cursor:'pointer'}
const Checkbox = ({name, label, isSelected, onCheckboxChange, children}) => (
  <div className="form-check" style={{marginTop:30}}>
    <label style={style}>
      <input style={{width:'16px',height:'16px'}}
        type="checkbox"
        name={name}
        checked={isSelected}
        onChange={onCheckboxChange}
        className="form-check-input"
      />
      {label}
    </label>
    {children}
  </div>
);

export default Checkbox;
