import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Router from "next/router";
import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/router";

import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  TransferFundsAddress,
  TransferFundsABI,
} from "./constant";

dotenv.config();

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

const connectingWithSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with smart contract");
  }
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTs";

  const [error, setError] = useState("");

  const [openError, setOpenError] = useState(false);

  const [currentAccount, setCurrentAccount] = useState("");

  const [accountBalance, setAccountBalance] = useState("");

  const router = useRouter();

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        return setOpenError(true), error("Install Metamask");
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        setError("No accounts found");
        setOpenError(true);
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const getBalance = await provider.getBalance(accounts[0]);

      const bal = ethers.utils.formatEther(getBalance);

      setAccountBalance(bal);
    } catch (error) {
      setError("Something Wrong while connecting to wallet");
      setOpenError(true);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return setOpenError(true), setError("Install Metamask");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      // window.location.reload();
    } catch (error) {
      setError("Error while connecting to wallet");
      setOpenError(true);
    }
  };

  const uploadToIPFS = async (file) => {
    if (!file) {
      console.error("No file provided");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_URL_POST_PINATA,
        data: formData,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.IpfsHash) {
        const fileUrl = `${process.env.NEXT_PUBLIC_URL_IMAGE_URL}${response.data.IpfsHash}`;

        return fileUrl;
      } else {
        throw new Error("IPFS Hash not returned from Pinata");
      }
    } catch (error) {
      console.error("Error while uploading file to IPFS:", error);
      return null;
    }
  };

  const createNFT = async (
    name,
    price,
    pinataData,
    description,
    router,
    category,
    fileExtension,
    fileSize,
    createdAt,
    token
  ) => {
    if (
      !name ||
      !description ||
      !price ||
      !pinataData ||
      !category ||
      !fileExtension ||
      !fileSize ||
      !createdAt ||
      !token
    ) {
      return setError("Data is missing"), setOpenError(true);
    }

    const data = JSON.stringify({
      name,
      description,
      pinataData,
      category,
      fileExtension,
      fileSize,
      createdAt,
    });

    try {
      const response = await axios({
        method: "POST",
        url: process.env.NEXT_PUBLIC_URL_POST_PINATA_JSON,
        data: data,
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          "Content-Type": "application/json",
        },
      });
      const url = `${process.env.NEXT_PUBLIC_URL_IMAGE_URL}${response.data.IpfsHash}`;

      const { transaction, tokenId } = await createSale(url, price);

      if (transaction) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/create-nft`,
          {
            name: name,
            description: description,
            price: price,
            pinataData: pinataData,
            category: category,
            fileExtension: fileExtension,
            fileSize: fileSize,
            createdAt: createdAt,
            owner: transaction.to,
            seller: transaction.from,
            tokenId: tokenId,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      router.push("/searchPage");
    } catch (error) {
      setError("Error while creating NFT");
      setOpenError(true);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      const price = ethers.utils.parseUnits(formInputPrice, "ether");

      const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.reSellToken(id, price, {
            value: listingPrice.toString(),
          });

      const txRecceipt = await transaction.wait();

      const event = txRecceipt.events?.find((e) => e.event === "Transfer");

      if (!event) {
        console.error("Transfer event not found", txRecceipt.events);
        return;
      }

      const tokenId = event.args.tokenId.toNumber();

      return { transaction, tokenId };
    } catch (error) {
      setError("Error while creating sale");
      setOpenError(true);
    }
  };

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      // const provider = new ethers.providers.JsonRpcProvider(
      //   "https://eth-sepolia.g.alchemy.com/v2/XbTCI1sk-nWg_2lJu90LU9FjQS6I94qj"
      // );

      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: {
                pinataData,
                name,
                description,
                category,
                fileExtension,
                fileSize,
                createdAt,
              },
            } = await axios.get(tokenURI);

            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            const countTokenLike = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/nft-likes?id=${tokenId}`
            );

            const likes = countTokenLike.data.likeCount;

            return {
              price,
              tokenId: tokenId.toString(),
              seller,
              owner,
              pinataData,
              name,
              description,
              tokenURI,
              category,
              fileExtension,
              fileSize,
              createdAt,
              likes,
            };
          }
        )
      );

      return items;
    } catch (error) {
      setError("Error while fetching NFTs");
      setOpenError(true);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      const contract = await connectingWithSmartContract();

      const data =
        type == "fetchItemsListed"
          ? await contract.fetchItemsListed()
          : await contract.fetchMyNFTs();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: {
                pinataData,
                name,
                description,
                category,
                fileExtension,
                fileSize,
                createdAt,
              },
            } = await axios.get(tokenURI);

            const price = ethers.utils.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            const countTokenLike = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/nft-likes?id=${tokenId}`
            );

            const likes = countTokenLike.data.likeCount;

            return {
              price,
              tokenId: tokenId.toNumber(),
              seller,
              owner,
              pinataData,
              name,
              description,
              tokenURI,
              category,
              fileExtension,
              fileSize,
              createdAt,
              likes,
            };
          }
        )
      );

      return items;
    } catch (error) {
      setError("Error while fetching listed NFTs");
      setOpenError(true);
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);

  const buyNFT = async (nft, token) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      const existTransaction = await transaction.wait();

      if (existTransaction) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/buy-nft`,
          {
            nftId: nft.tokenId,
            owner: existTransaction.from,
            seller: existTransaction.to,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      router.push("/author");
    } catch (error) {
      setError("Error while buying NFT");
      setOpenError(true);
    }
  };

  const [transactionCount, setTransactionCount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransferFundsContract = (signerOrProvider) =>
    new ethers.Contract(
      TransferFundsAddress,
      TransferFundsABI,
      signerOrProvider
    );

  const connectToTransferFundsContract = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchTransferFundsContract(signer);

      return contract;
    } catch (error) {
      console.log("Something went wrong while connecting with smart contract");
    }
  };

  const transferEther = async (isAddress, price, message) => {
    try {
      if (currentAccount) {
        const contract = await connectToTransferFundsContract();

        const unFormatedAmount = ethers.utils.parseEther(price);
        await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: currentAccount,
              to: isAddress,
              gas: "0x5208",
              value: unFormatedAmount._hex,
            },
          ],
        });
        const transaction = await contract.addToBlockchain(
          isAddress,
          unFormatedAmount,
          message
        );

        setLoading(true);

        transaction.wait();

        setLoading(false);

        const transactionCount = await contract.getTransactionCount();

        setTransactionCount(transactionCount.toNumber());

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const contract = await connectToTransferFundsContract();

        const avaliableTransactions = await contract.getAllTransactions();

        const readTransaction = avaliableTransactions.map((transaction) => ({
          addressTo: transaction.receiver,
          addressFrom: transaction.sender,
          timestamp: new Date(
            transaction.timestamp.toNumber() * 1000
          ).toLocaleString(),
          message: transaction.message,
          amount: parseInt(transaction.amount._hex) / 10 ** 18,
        }));

        setTransactions(readTransaction);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkIfWalletIsConnected,
        connectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        createSale,
        currentAccount,
        titleData,
        setOpenError,
        setError,
        openError,
        error,
        transferEther,
        getAllTransactions,
        loading,
        accountBalance,
        transactionCount,
        transactions,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
