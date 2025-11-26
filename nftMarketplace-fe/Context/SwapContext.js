import React, { useEffect, useState } from "react";
import {
  CustomTokenAddress,
  CustomTokenABI,
  AmmSwapAddress,
  AmmSwapABI,
} from "./constant";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const ETH_HOOBI_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

const fetchCustomTokenContract = (signerOrProvider) =>
  new ethers.Contract(CustomTokenAddress, CustomTokenABI, signerOrProvider);

const connectingWithCustomTokenSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchCustomTokenContract(signer);

    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with smart contract");
  }
};

const fetchAmmSwapContract = (signerOrProvider) =>
  new ethers.Contract(AmmSwapAddress, AmmSwapABI, signerOrProvider);

const connectToAmmSwapContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchAmmSwapContract(signer);

    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with smart contract");
  }
};

export const SwapContext = React.createContext();

export const SwapContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [ammContract, setAmmContract] = useState(null);
  const [zellContract, setZellContract] = useState(null);
  const [reserves, setReserves] = useState({ reserve0: 0n, reserve1: 0n });
  const [userZellBalance, setUserZellBalance] = useState("0");
  const [userETHBalance, setUserETHBalance] = useState("0");

  useEffect(() => {
    const prov = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(prov);

    const loadContracts = async () => {
      const sign = await prov.getSigner();
      setSigner(sign);
      const amm = fetchAmmSwapContract(sign);
      const zell = fetchCustomTokenContract(sign);
      setAmmContract(amm);
      setZellContract(zell);

      const [r0, r1] = await Promise.all([amm.reserve0(), amm.reserve1()]);
      setReserves({ reserve0: r0, reserve1: r1 });
    };

    loadContracts();

    if (ammContract) {
      ammContract.on("Swap", () => loadContracts());
    }
  }, []);

  const calculateOutput = (amountIn, isFromETH) => {
    if (!amountIn || amountIn === "0") return "";
    const amount = ethers.parseEther(amountIn);
    const { reserve0, reserve1 } = reserves;

    if (reserve0 === 0n || reserve1 === 0n) return "No liquidity";

    const reserveIn = isFromETH ? reserve1 : reserve0;
    const reserveOut = isFromETH ? reserve0 : reserve1;

    const amountInWithFee = (amount * 997n) / 1000n;
    const amountOut =
      (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);

    return ethers.formatEther(amountOut);
  };

  const swap = async (amountIn, isFromETH) => {
    if (!ammContract || !signer) throw new Error("Not connected");

    const tokenIn = isFromETH ? ETH_HOOBI_ADDRESS : CustomTokenAddress;
    const tokenContract = new ethers.Contract(tokenIn, CustomTokenABI, signer);
    const amount = ethers.parseEther(amountIn);

    const allowance = await tokenContract.allowance(
      await signer.getAddress(),
      AmmSwapAddress
    );
    if (allowance < amount) {
      const tx = await tokenContract.approve(AmmSwapAddress, ethers.MaxUint256);
      await tx.wait();
    }

    const tx = await ammContract.swap(tokenIn, amount, 0);
    await tx.wait();
  };

  const addLiquidity = async () => {};

  return (
    <SwapContext.Provider
      value={{
        calculateOutput,
        swap,
        addLiquidity,
        reserves,
        userZellBalance,
        userETHBalance,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};
