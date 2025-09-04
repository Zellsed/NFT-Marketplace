import React, { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import Style from "./Login.module.css";
import { Button } from "../../components/componentsindex.js";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext.js";
import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/router";

dotenv.config();

const Login = () => {
  const { currentAccount, connectWallet } = useContext(NFTMarketplaceContext);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Please fill in all the required fields.");
      return;
    }

    const reponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
      {
        currentAccount,
        email,
        password,
      }
    );

    const token = reponse.data.access_token;
    const expiresAt = Date.now() + 60 * 60 * 1000;

    localStorage.setItem("access_token", token);
    localStorage.setItem("expires_at", expiresAt.toString());

    router.push("/");
  };

  return (
    <div className={Style.user}>
      {!currentAccount ? (
        <>
          <div className={Style.text}>
            <h2>Please connect your MetaMask wallet to continue 🦊</h2>
            <p>
              To login an account, you need to connect your MetaMask wallet.
              This ensures identity verification and account security. Click the
              "Connect MetaMask" button to proceed.
            </p>
          </div>
          <div className={Style.wallet_connect}>
            <Button
              btnName="Connect MetaMask"
              classStyle={Style.button}
              onClick={connectWallet}
            />
          </div>
        </>
      ) : (
        <div className={Style.user_box}>
          <div className={Style.user_box_input}>
            <div className={Style.user_box_input_box}>
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={Style.user_box_input_box}>
              <label
                htmlFor="password"
                className={Style.user_box_input_box_label}
              >
                <p>Password</p>
              </label>
              <div className={Style.password_input}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={Style.eye_icon}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <p className={Style.forgetPassword}>
              <a href="#">Forget password?</a>
            </p>
          </div>

          <Button
            btnName="Continue"
            classStyle={Style.button}
            onClick={handleSignUp}
          />
        </div>
      )}
    </div>
  );
};

export default Login;
