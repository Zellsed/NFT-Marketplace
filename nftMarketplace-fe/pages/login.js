import React from "react";

import Style from "../styles/login.module.css";
import Login from "../Ingredients/loginAndSignUp/Login/Login";

const login = () => {
  return (
    <div className={Style.login}>
      <div className={Style.login_box}>
        <h1>Login</h1>
        <Login />
      </div>
    </div>
  );
};

export default login;
