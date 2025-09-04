import React from "react";

import Style from "./Button.module.css";

const Button = ({ btnName, onClick, icon, classStyle }) => {
  return (
    <div className={Style.box}>
      <button className={`${Style.button} ${classStyle}`} onClick={onClick}>
        {icon} {btnName}
      </button>
    </div>
  );
};

export default Button;
