// SwapWidget.jsx – PHIÊN BẢN SIÊU ĐẸP + TỐI ƯU MOBILE + UX PRO
import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Style from "./SwapWidget.module.css";
import {
  ArrowPathIcon,
  ArrowsUpDownIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";
import { SwapContext } from "../../../Context/SwapContext";

export default function SwapWidget() {
  const [mode, setMode] = useState("swap"); // swap | liquidity
  const [loading, setLoading] = useState(false);

  // Swap states
  const [inputAmount, setInputAmount] = useState("");
  const [outputAmount, setOutputAmount] = useState("");
  const [isFromETH, setIsFromETH] = useState(true);

  // Liquidity states
  const [ethLiquidity, setEthLiquidity] = useState("");
  const [zellLiquidity, setZellLiquidity] = useState("");

  const {
    currentAccount,
    accountBalance,
    connectWallet,
    checkIfWalletIsConnected,
  } = useContext(NFTMarketplaceContext);
  const { calculateOutput, swap, addLiquidity, zellBalance } =
    useContext(SwapContext);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Tối ưu: chỉ tính khi thật sự cần
  useEffect(() => {
    if (!inputAmount || inputAmount === "0" || isNaN(inputAmount)) {
      setOutputAmount("");
      return;
    }
    calculateOutput(inputAmount, isFromETH);
  }, [inputAmount, isFromETH, calculateOutput]);

  // Hàm set MAX
  const handleMax = () => {
    if (!accountBalance) return;
    const formatted = ethers.utils.formatEther(accountBalance);
    setInputAmount(formatted.slice(0, formatted.indexOf(".") + 6));
  };

  const handleSwap = async () => {
    if (!inputAmount) return;
    setLoading(true);
    try {
      await swap(inputAmount, isFromETH);
      setInputAmount("");
      setOutputAmount("");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLiquidity = async () => {
    if (!ethLiquidity || !zellLiquidity) return;
    setLoading(true);
    try {
      await addLiquidity(ethLiquidity, zellLiquidity);
      setEthLiquidity("");
      setZellLiquidity("");
    } finally {
      setLoading(false);
    }
  };

  // Tính giá realtime
  const priceRatio =
    inputAmount && outputAmount && parseFloat(outputAmount) > 0
      ? (parseFloat(inputAmount) / parseFloat(outputAmount)).toFixed(4)
      : "0";

  return (
    <div className={Style.container}>
      <div className={Style.card}>
        {/* Header */}
        <div className={Style.header}>
          <h2>{mode === "swap" ? "Swap" : "Add Liquidity"}</h2>
          <button
            className={Style.refreshBtn}
            onClick={() => window.location.reload()}
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab */}
        <div className={Style.tabContainer}>
          <button
            onClick={() => setMode("swap")}
            className={`${Style.tab} ${mode === "swap" ? Style.activeTab : ""}`}
          >
            Swap
          </button>
          <button
            onClick={() => setMode("liquidity")}
            className={`${Style.tab} ${
              mode === "liquidity" ? Style.activeTab : ""
            }`}
          >
            <PlusIcon className="w-4 h-4" /> Liquidity
          </button>
        </div>

        {/* SWAP MODE */}
        {mode === "swap" && (
          <>
            {/* FROM */}
            <div className={Style.inputBox}>
              <div className={Style.label}>
                <span>From</span>
                <div className={Style.balanceRow}>
                  <span>
                    Balance:{" "}
                    {accountBalance
                      ? (+ethers.utils.formatEther(accountBalance)).toFixed(4)
                      : "0"}{" "}
                    ETH
                  </span>
                  <button onClick={handleMax} className={Style.maxBtn}>
                    MAX
                  </button>
                </div>
              </div>
              <div className={Style.inputRow}>
                <input
                  type="number"
                  placeholder="0.0"
                  value={inputAmount}
                  onChange={(e) => setInputAmount(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className={Style.amountInput}
                />
                <div className={Style.tokenSelector}>
                  <div className={Style.tokenIcon}>ETH</div>
                  <span>ETH</span>
                </div>
              </div>
            </div>

            {/* Switch Button */}
            <div className={Style.switchWrapper}>
              <button
                onClick={() => setIsFromETH(!isFromETH)}
                className={Style.switchBtn}
              >
                <ArrowsUpDownIcon className="w-6 h-6" />
              </button>
            </div>

            {/* TO */}
            <div className={Style.inputBox}>
              <div className={Style.label}>
                <span>To {isFromETH ? "(ZELL)" : "(ETH)"}</span>
                <span>
                  Balance:{" "}
                  {zellBalance
                    ? (+ethers.utils.formatEther(zellBalance)).toFixed(4)
                    : "0"}{" "}
                  ZELL
                </span>
              </div>
              <div className={Style.inputRow}>
                <div className={Style.amountOutput}>
                  {outputAmount || "0.0"}
                </div>
                <div className={`${Style.tokenSelector} ${Style.zell}`}>
                  <div className={Style.tokenIcon}>ZELL</div>
                  <span>ZELL</span>
                </div>
              </div>
            </div>

            {/* Giá realtime */}
            {inputAmount && outputAmount && (
              <div className={Style.priceInfo}>1 ETH ≈ {priceRatio} ZELL</div>
            )}

            <div className={Style.infoCard}>
              <div className={Style.infoRow}>
                <span>Price Impact</span>
                <span className={Style.success}>&lt; 0.5%</span>
              </div>
              <div className={Style.infoRow}>
                <span>Fee</span>
                <span>0.3%</span>
              </div>
            </div>
          </>
        )}

        {/* LIQUIDITY MODE */}
        {mode === "liquidity" && (
          <>
            <div className={Style.inputBox}>
              <div className={Style.label}>
                <span>Deposit ETH</span>
                <span>
                  Balance:{" "}
                  {accountBalance
                    ? (+ethers.utils.formatEther(accountBalance)).toFixed(4)
                    : "0"}
                </span>
              </div>
              <div className={Style.inputRow}>
                <input
                  type="number"
                  placeholder="0.0"
                  value={ethLiquidity}
                  onChange={(e) => setEthLiquidity(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className={Style.amountInput}
                />
                <div className={Style.tokenSelector}>
                  <div className={Style.tokenIcon}>ETH</div>
                  <span>ETH</span>
                </div>
              </div>
            </div>

            <div className={Style.plusIcon}>
              <PlusIcon className="w-8 h-8" />
            </div>

            <div className={Style.inputBox}>
              <div className={Style.label}>
                <span>Deposit ZELL</span>
                <span>
                  Balance:{" "}
                  {zellBalance
                    ? (+ethers.utils.formatEther(zellBalance)).toFixed(4)
                    : "0"}
                </span>
              </div>
              <div className={Style.inputRow}>
                <input
                  type="number"
                  placeholder="0.0"
                  value={zellLiquidity}
                  onChange={(e) => setZellLiquidity(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className={Style.amountInput}
                />
                <div className={`${Style.tokenSelector} ${Style.zell}`}>
                  <div className={Style.tokenIcon}>ZELL</div>
                  <span>ZELL</span>
                </div>
              </div>
            </div>

            <div className={Style.infoCard}>
              <div className={Style.infoRow}>
                <span>You will receive</span>
                <span className={Style.success}>ETH-ZELL LP Token</span>
              </div>
            </div>
          </>
        )}

        {/* Nút hành động */}
        {currentAccount ? (
          <button
            onClick={mode === "swap" ? handleSwap : handleAddLiquidity}
            disabled={
              loading ||
              (mode === "swap"
                ? !inputAmount || parseFloat(inputAmount) === 0
                : !ethLiquidity || !zellLiquidity)
            }
            className={Style.swapButton}
          >
            {loading ? (
              <div className={Style.loader}>
                <span>Đang xử lý</span>
              </div>
            ) : mode === "swap" ? (
              "Swap"
            ) : (
              "Supply"
            )}
          </button>
        ) : (
          <button onClick={connectWallet} className={Style.connectButton}>
            Connect Wallet
          </button>
        )}

        {currentAccount && (
          <div className={Style.walletAddress}>
            {currentAccount.slice(0, 6)}...{currentAccount.slice(-4)}
          </div>
        )}
      </div>
    </div>
  );
}
