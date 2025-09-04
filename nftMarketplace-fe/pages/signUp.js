import React from "react";

import Style from "../styles/login.module.css";
import SignUp from "../Ingredients/loginAndSignUp/SignUp/SignUp";

const signUp = () => {
  return (
    <div className={Style.login}>
      <div className={Style.login_box}>
        <h1>SignUp</h1>
        <SignUp />
      </div>
    </div>
  );
};

export default signUp;
