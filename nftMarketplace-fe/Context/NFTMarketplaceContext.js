import React, { useState, useEffect, useContext } from "react";
import Web3Modal from "web3modal";
import { BigNumber, ethers } from "ethers";
import Router from "next/router";
import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/router";
import { PinataSDK } from "pinata";

import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  TransferFundsAddress,
  TransferFundsABI,
  TranferTokenAddress,
  TranferTokenABI,
  CustomTokenAddress,
  CustomTokenABI,
  NFTCollection1155Address,
  NFTCollection1155ABI,
} from "./constant";

dotenv.config();

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT_TOKEN,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GETWAY,
});

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

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTs";

  const [error, setError] = useState("");

  const [openError, setOpenError] = useState(false);

  const [currentAccount, setCurrentAccount] = useState("");

  const [accountBalance, setAccountBalance] = useState("");

  const [baseCoinNetwork, setBaseCoinNetwork] = useState("");

  const [tokenSymbol, setTokenSymbol] = useState("");

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

      const network = await provider.getNetwork();

      // console.log("Connected chainId:", network.chainId);
      // console.log("Network name:", network.name);

      let coinSymbol = "Unknown";

      switch (network.chainId) {
        case 17000:
          coinSymbol = "ETH";
          break;
        case 31337:
          coinSymbol = "ETH";
          break;
        case 80002:
          coinSymbol = "POLY";
          break;
        default:
          coinSymbol = `Unknown Chain (${network.chainId})`;
          break;
      }

      setAccountBalance(bal);
      setBaseCoinNetwork(coinSymbol);

      const customTokenContract =
        await connectingWithCustomTokenSmartContract();

      setTokenSymbol(await customTokenContract.symbol());
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
      const upload = await pinata.upload.public.file(file);

      if (upload.cid) {
        const fileUrl = `https://amaranth-mad-gayal-357.mypinata.cloud/ipfs/${upload.cid}`;

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
      const upload = await pinata.upload.public.json(data);

      const url = `https://amaranth-mad-gayal-357.mypinata.cloud/ipfs/${upload.cid}`;

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
      const price = ethers.utils.parseUnits(formInputPrice.toString(), 18);

      const contract = await connectingWithSmartContract();
      const customTokenContract =
        await connectingWithCustomTokenSmartContract();

      const listingPrice = await contract.getListingPrice();
      const approveListingPrice = ethers.utils.parseUnits(
        listingPrice.toString(),
        18
      );

      const approval = await customTokenContract.approve(
        contract.address,
        approveListingPrice
      );

      await approval.wait();

      const transaction = !isReselling
        ? await contract.createToken(url, price)
        : await contract.reSellToken(id, price);

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

  const createNFT1155 = async (
    name,
    price,
    totalSupply,
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
      !totalSupply ||
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
      const upload = await pinata.upload.public.json(data);

      const url = `https://amaranth-mad-gayal-357.mypinata.cloud/ipfs/${upload.cid}`;

      const { transaction, tokenId } = await createSale1155(
        url,
        totalSupply,
        price
      );

      router.push("/searchPage");
    } catch (error) {
      setError("Error while creating NFT1155");
      setOpenError(true);
    }
  };

  const createSale1155 = async (url, totalSupply, formInputPrice) => {
    try {
      const price = ethers.utils.parseUnits(formInputPrice.toString(), 18);

      const nftCollection1155Contract =
        await connectToNftCollection1155Contract();
      const contract = await connectingWithSmartContract();
      const customTokenContract =
        await connectingWithCustomTokenSmartContract();

      const listingPrice = await contract.getListingPrice();

      const approveListingPrice = ethers.utils.parseUnits(
        listingPrice.toString(),
        18
      );

      const approval = await customTokenContract.approve(
        contract.address,
        approveListingPrice
      );

      await approval.wait();

      const txApprove1155 = await nftCollection1155Contract.setApprovalForAll(
        contract.address,
        true
      );

      await txApprove1155.wait();

      const transaction = await contract.createToken1155(
        url,
        totalSupply,
        price
      );

      const txRecceipt = await transaction.wait();

      const event = txRecceipt.events?.find(
        (e) => e.event === "MarketItem1155Created"
      );

      if (!event) {
        console.error(
          "MarketItem1155Created event not found",
          txRecceipt.events
        );
        return;
      }

      const tokenId = event.args.tokenId.toNumber();

      return { transaction, tokenId };
    } catch (error) {
      setError("Error while creating sale1155");
      setOpenError(true);
    }
  };

  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();
      // const provider = new ethers.providers.JsonRpcProvider(
      //   "https://eth-holesky.g.alchemy.com/v2/XbTCI1sk-nWg_2lJu90LU9FjQS6I94qj"
      // );

      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems();

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            const tokenURI = await contract.tokenURI(tokenId);

            const { data } = await axios.get(tokenURI);

            const metadata = typeof data === "string" ? JSON.parse(data) : data;

            const {
              pinataData,
              name,
              description,
              category,
              fileExtension,
              fileSize,
              createdAt,
            } = metadata;

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

  const fetchNFTs1155 = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();

      const contract = fetchContract(provider);

      const data = await contract.fetchMarketItems1155();

      const items = await Promise.all(
        data.map(
          async ({
            itemId,
            nftContract,
            tokenId,
            amount,
            amountAvailable,
            totalPrice,
            price,
            seller,
            owner,
          }) => {
            const nft = new ethers.Contract(
              nftContract,
              NFTCollection1155ABI,
              provider
            );
            const tokenURI = await nft.uri(tokenId);

            const { data } = await axios.get(tokenURI);

            const metadata = typeof data === "string" ? JSON.parse(data) : data;

            const {
              pinataData,
              name,
              description,
              category,
              fileExtension,
              fileSize,
              createdAt,
            } = metadata;

            const totalPriceData = ethers.utils.formatUnits(
              totalPrice.toString(),
              "ether"
            );

            const priceData = ethers.utils.formatUnits(
              price.toString(),
              "ether"
            );

            return {
              itemId: itemId.toString(),
              price: priceData,
              totalPrice: totalPriceData,
              amount: amount.toString(),
              amountAvailable: amountAvailable.toString(),
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
    fetchNFTs1155();
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

            const { data } = await axios.get(tokenURI);

            const metadata = typeof data === "string" ? JSON.parse(data) : data;

            const {
              pinataData,
              name,
              description,
              category,
              fileExtension,
              fileSize,
              createdAt,
            } = metadata;

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

  const fetchMyNFTsCollectionOrListedNFTs = async (type) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider();

      const contract = fetchContract(provider);

      // const data =
      //   type == "fetchItemsListed"
      //     ? await contract.fetchItemsListed1155()
      //     : await contract.fetchMyNFTs1155();

      const data = await contract.fetchMyNFTs1155();

      console.log("data:", data);

      const data2 = await contract.fetchItemsListed1155();

      console.log("data:", data2);

      const items = await Promise.all(
        data.map(
          async ({
            itemId,
            nftContract,
            tokenId,
            amount,
            amountAvailable,
            totalPrice,
            price,
            seller,
            owner,
          }) => {
            console.log("nftContract:", nftContract);
            console.log("tokenId:", tokenId);
            console.log("seller:", seller);
            console.log("owner:", owner);
            console.log("price:", price);
            console.log("totalPrice:", totalPrice);
            console.log("amount:", amount);
            console.log("amountAvailable:", amountAvailable);
            const nft = new ethers.Contract(
              nftContract,
              NFTCollection1155ABI,
              provider
            );
            const tokenURI = await nft.uri(tokenId);

            const { data } = await axios.get(tokenURI);

            console.log("data:", data);

            // const metadata = typeof data === "string" ? JSON.parse(data) : data;

            // const {
            //   pinataData,
            //   name,
            //   description,
            //   category,
            //   fileExtension,
            //   fileSize,
            //   createdAt,
            // } = metadata;

            // const price = ethers.utils.formatUnits(
            //   unformattedPrice.toString(),
            //   "ether"
            // );

            // const countTokenLike = await axios.get(
            //   `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/nft-likes?id=${tokenId}`
            // );

            // const likes = countTokenLike.data.likeCount;

            // return {
            //   price,
            //   tokenId: tokenId.toNumber(),
            //   seller,
            //   owner,
            //   pinataData,
            //   name,
            //   description,
            //   tokenURI,
            //   category,
            //   fileExtension,
            //   fileSize,
            //   createdAt,
            //   likes,
            // };
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
    fetchMyNFTsCollectionOrListedNFTs();
  }, []);

  const buyNFT = async (nft, token) => {
    try {
      const contract = await connectingWithSmartContract();
      const customTokenContract =
        await connectingWithCustomTokenSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), 18);

      const approval = await customTokenContract.approve(
        contract.address,
        price
      );

      await approval.wait();

      const transaction = await contract.createMarketSale(nft.tokenId);

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

  const buyNFT1155 = async (nft, quantity, token) => {
    try {
      const contract = await connectingWithSmartContract();
      const customTokenContract =
        await connectingWithCustomTokenSmartContract();
      const NFTColelction1155Contract =
        await connectToNftCollection1155Contract();
      const price = ethers.utils.parseUnits(nft.price.toString(), 18);

      const totalPrice = price.mul(BigNumber.from(quantity));

      const approval = await customTokenContract.approve(
        contract.address,
        totalPrice
      );

      await approval.wait();

      await NFTColelction1155Contract.setApprovalForAll(contract.address, true);

      console.log("Buying NFT1155:", nft, "Quantity:", quantity);

      const transaction = await contract.buyToken1155(nft.itemId, quantity);

      const existTransaction = await transaction.wait();

      console.log("existTransaction:", existTransaction);

      //  if (existTransaction) {
      //    await axios.post(
      //      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/buy-nft`,
      //      {
      //        nftId: nft.tokenId,
      //        owner: existTransaction.from,
      //        seller: existTransaction.to,
      //      },
      //      {
      //        headers: { Authorization: `Bearer ${token}` },
      //      }
      //    );
      //  }

      //  router.push("/author");
    } catch (error) {
      console.error("Error while buying NFT1155:", error);

      if (error.data) console.error("Error data:", error.data);
      if (error.reason) console.error("Error reason:", error.reason);
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

  const fetchTransferTokenContract = (signerOrProvider) =>
    new ethers.Contract(TranferTokenAddress, TranferTokenABI, signerOrProvider);

  const connectToTransferTokenContract = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchTransferTokenContract(signer);

      return contract;
    } catch (error) {
      console.log("Something went wrong while connecting with smart contract");
    }
  };

  const fetchNftCollection1155Contract = (signerOrProvider) =>
    new ethers.Contract(
      NFTCollection1155Address,
      NFTCollection1155ABI,
      signerOrProvider
    );

  const connectToNftCollection1155Contract = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchNftCollection1155Contract(signer);

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

  const tranferToken = async (baseCoin, tokenAmount) => {
    try {
      if (baseCoin === "ETH") {
        const contract = await connectToTransferTokenContract();

        const unFormatedAmount = ethers.utils.parseEther(tokenAmount);

        const transaction = await contract.buyWebTokenWithBaseCoin(baseCoin, {
          value: unFormatedAmount,
        });

        setLoading(true);

        transaction.wait();

        setLoading(false);

        window.location.reload();
      } else {
        const contract = await connectToTransferTokenContract();
        const customTokenContract =
          await connectingWithCustomTokenSmartContract();

        const unFormatedAmount = ethers.utils.parseEther(tokenAmount);

        const transaction = await contract.buyWebTokenWithBaseCoin(baseCoin, {
          value: unFormatedAmount,
        });

        setLoading(true);

        transaction.wait();

        setLoading(false);

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tokenBalance = async (address) => {
    try {
      const contract = await connectToTransferTokenContract();

      const balance = await contract.getUserActualBalance(address);

      return balance.toString();
    } catch (error) {
      console.log("Error tokenBalance:", error);
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
        fetchNFTs1155,
        fetchMyNFTsOrListedNFTs,
        fetchMyNFTsCollectionOrListedNFTs,
        buyNFT,
        buyNFT1155,
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
        baseCoinNetwork,
        tranferToken,
        // depositToken,
        tokenBalance,
        tokenSymbol,
        createNFT1155,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};
