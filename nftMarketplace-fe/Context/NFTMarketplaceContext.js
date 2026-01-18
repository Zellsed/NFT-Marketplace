import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/router";
import { PinataSDK } from "pinata";

import {
  DeployerAddress,
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
  NFTStakingAddress,
  NFTStakingABI,
} from "./constant";

dotenv.config();

import NetworkModal from "../Ingredients/NetworkModal/NetworkModal";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT_TOKEN,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GETWAY,
});

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
    signerOrProvider,
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

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider,
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

const fetchNftStakingContract = (signerOrProvider) =>
  new ethers.Contract(NFTStakingAddress, NFTStakingABI, signerOrProvider);

const connectingWithNftStakingSmartContract = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchNftStakingContract(signer);

    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with smart contract");
  }
};

const fetchTransferFundsContract = (signerOrProvider) =>
  new ethers.Contract(TransferFundsAddress, TransferFundsABI, signerOrProvider);

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

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Khám phá, sưu tầm và mua bán NFT";

  const [error, setError] = useState("");

  const [openError, setOpenError] = useState(false);

  const [currentAccount, setCurrentAccount] = useState("");

  const [accountBalance, setAccountBalance] = useState("");

  const [baseCoinNetwork, setBaseCoinNetwork] = useState("");

  const [tokenSymbol, setTokenSymbol] = useState("");

  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const router = useRouter();

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(accounts[0]);
        setAccountBalance(ethers.utils.formatEther(balance));

        const coinSymbol = getCoinSymbol(network.chainId);
        setBaseCoinNetwork(coinSymbol);

        try {
          const customTokenContract =
            await connectingWithCustomTokenSmartContract();

          if (customTokenContract) {
            setTokenSymbol(await customTokenContract.symbol());
          }
        } catch (e) {
          console.log("Token contract not available on this network");
        }
      }
    } catch (error) {
      console.error("Error while connecting to wallet:", error);
    }
  };

  const getCoinSymbol = (chainId) => {
    const map = {
      1: "ETH",
      31337: "ETH",
      560048: "ETH",
      56: "BNB",
      97: "BNB",
      137: "POL",
      80002: "POL",
    };

    return map[chainId] || `Unknown (${chainId})`;
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const switchNetwork = async (network) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${network.chainId.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: {
                  name: network.symbol,
                  symbol: network.symbol,
                  decimals: 18,
                },
                blockExplorerUrls: network.blockExplorer
                  ? [network.blockExplorer]
                  : null,
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
          setError("Failed to add network");
          setOpenError(true);
        }
      } else {
        console.error("Failed to switch network:", switchError);
        setError("Failed to switch network");
        setOpenError(true);
      }
    }
  };

  const handleSelectNetwork = async (network) => {
    try {
      setSelectedNetwork(network);
      setShowNetworkModal(false);

      await switchNetwork(network);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);

      await checkIfWalletIsConnected();
    } catch (error) {
      console.error("Failed to connect after network switch:", error);
      setError("Failed to connect wallet after switching network");
      setOpenError(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      let lastChainId = null;
      const handleChainchanged = (chainId) => {
        if (lastChainId !== chainId) {
          lastChainId = chainId;
          console.log("Chain changed", chainId);
          window.location.reload();
        }
      };

      window.ethereum.on("chainChanged", handleChainchanged);
      return () => {
        window.ethereum.removeListener("chainChanged", handleChainchanged);
      };
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return setOpenError(true), setError("Install Metamask");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();

      const isValidNetwork = [31337, 560048, 80002].includes(network.chainId);
      if (!forceNetworkSelect && isValidNetwork) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
        return;
      }

      setShowNetworkModal(false);
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
    token,
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

      await createSale(url, price);

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
        18,
      );

      const approval = await customTokenContract.approve(
        contract.address,
        approveListingPrice,
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
    token,
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

      await createSale1155(url, totalSupply, price);

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
        18,
      );

      const approval = await customTokenContract.approve(
        contract.address,
        approveListingPrice,
      );

      await approval.wait();

      const txApprove1155 = await nftCollection1155Contract.setApprovalForAll(
        contract.address,
        true,
      );

      await txApprove1155.wait();

      const transaction = await contract.createToken1155(
        url,
        totalSupply,
        price,
      );

      const txRecceipt = await transaction.wait();

      const event = txRecceipt.events?.find(
        (e) => e.event === "MarketItem1155Created",
      );

      if (!event) {
        console.error(
          "MarketItem1155Created event not found",
          txRecceipt.events,
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

  const reSellToken1155 = async (id, quantity, price) => {
    try {
      if (!id || !quantity || !price) {
        throw new Error("❌ Missing parameters for resell");
      }

      const nftCollection1155Contract =
        await connectToNftCollection1155Contract();
      const contract = await connectingWithSmartContract();
      const customTokenContract =
        await connectingWithCustomTokenSmartContract();

      if (!contract || !customTokenContract || !nftCollection1155Contract) {
        throw new Error("❌ Failed to connect to contracts");
      }

      const newPrice = ethers.utils.parseUnits(price.toString(), 18);

      const listingPrice = await contract.getListingPrice();

      const approvalFee = await customTokenContract.approve(
        contract.address,
        listingPrice,
      );

      await approvalFee.wait();

      const txApproveNFT = await nftCollection1155Contract.setApprovalForAll(
        contract.address,
        true,
      );

      await txApproveNFT.wait();

      const transaction = await contract.reSellToken1155(
        id,
        quantity,
        newPrice,
      );

      const receipt = await transaction.wait();

      const event = receipt.events?.find(
        (e) => e.event === "MarketItem1155Created",
      );

      if (!event) {
        console.warn(
          "⚠️ Event MarketItem1155Created not found",
          receipt.events,
        );
        return;
      }
    } catch (error) {
      setError(`Error while creating sale1155: ${error.message}`);
      setOpenError(true);
    }
  };

  const fetchNFTs = async ({ page, limit } = {}) => {
    try {
      const nftData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/all-nft-marketplace`,
        {
          params: { page, limit },
        },
      );

      const items = nftData.data.data.map((e) => ({
        price: e.nft_price,
        tokenId: e.token_id,
        seller: e.nft_seller,
        owner: e.nft_owner,
        pinataData: e.pinata_data,
        name: e.metadata_name,
        description: e.metadata_description,
        tokenURI: e.token_uri,
        category: e.metadata_category,
        fileExtension: e.file_extension,
        fileSize: e.file_size,
        createdAt: e.created_at,
        likes: e.like,
      }));

      return {
        items,
        totalRows: nftData.data.totalRows,
        totalPages: Math.ceil(nftData.data.totalRows / limit),
      };
    } catch (error) {
      setError("Error while fetching NFTs");
      setOpenError(true);
      return {
        items: [],
        totalRows: 0,
        totalPages: 1,
      };
    }
  };

  const getSliderData = async () => {
    try {
      const sliderData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/slider-data`,
      );

      const items = await Promise.all(
        sliderData.data.data.map(async (e) => {
          return {
            price: e.nft_price,
            tokenId: e.token_id,
            seller: e.nft_seller,
            owner: e.nft_owner,
            pinataData: e.pinata_data,
            name: e.metadata_name,
            description: e.metadata_description,
            tokenURI: e.token_uri,
            category: e.metadata_category,
            fileExtension: e.file_extension,
            fileSize: e.file_size,
            createdAt: e.created_at,
            likes: e.like,
            account: e.user.account,
            email: e.user.email,
            userName: e.user.name,
            photo: e.userInformation.photo,
            background: e.userInformation.background,
            description: e.userInformation.description,
          };
        }),
      );

      return items;
    } catch (error) {
      setError("Error while fetching slider data");
      setOpenError(true);
    }
  };

  const fetchNFTs1155 = async ({ page, limit } = {}) => {
    try {
      const nft1155Data = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/all-nft-marketplace-1155`,
        {
          params: { page, limit },
        },
      );

      const items = await Promise.all(
        nft1155Data.data.data.map(async (e) => {
          return {
            itemId: e.item_id,
            tokenId: e.token_id,
            amount: e.nft_amount,
            amountAvailable: e.amount_available,
            price: e.nft_price,
            totalPrice: e.total_price,
            seller: e.nft_seller,
            owner: e.nft_owner,
            pinataData: e.pinata_data,
            name: e.metadata_name,
            description: e.metadata_description,
            tokenURI: e.token_uri,
            category: e.metadata_category,
            fileExtension: e.file_extension,
            fileSize: e.file_size,
            createdAt: e.created_at,
            likes: e.like,
          };
        }),
      );
      console.log(items);

      return {
        items,
        totalRows: nftData.data.totalRows,
        totalPages: Math.ceil(nftData.data.totalRows / limit),
      };
    } catch (error) {
      setError("Error while fetching NFTs");
      setOpenError(true);
      return {
        items: [],
        totalRows: 0,
        totalPages: 1,
      };
    }
  };

  useEffect(() => {
    fetchNFTs();
    fetchNFTs1155();
  }, []);

  const fetchMyNFTsOrListedNFTs = async (type, token) => {
    try {
      const response =
        type == "fetchItemsListed"
          ? await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/all-my-nft-721-listed`,
              { headers: { Authorization: `Bearer ${token}` } },
            )
          : await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/all-my-nft-721`,
              { headers: { Authorization: `Bearer ${token}` } },
            );

      const items = await Promise.all(
        response.data.data.map(async (e) => {
          return {
            price: e.nft_price,
            tokenId: e.token_id,
            seller: e.nft_seller,
            owner: e.nft_owner,
            pinataData: e.pinata_data,
            name: e.metadata_name,
            description: e.metadata_description,
            tokenURI: e.token_uri,
            category: e.metadata_category,
            fileExtension: e.file_extension,
            fileSize: e.file_size,
            createdAt: e.created_at,
            likes: e.like,
          };
        }),
      );

      return items;
    } catch (error) {
      setError("Error while fetching listed NFTs");
      setOpenError(true);
    }
  };

  const fetchMyNFTsOrListedNFTs1155 = async (type, token) => {
    try {
      const response =
        type == "fetchItemsListed"
          ? await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/all-my-nft-1155-listed`,
              { headers: { Authorization: `Bearer ${token}` } },
            )
          : await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/all-my-nft-1155`,
              { headers: { Authorization: `Bearer ${token}` } },
            );

      const items = await Promise.all(
        response.data.data.map(async (e) => {
          return {
            itemId: e.item_id,
            tokenId: e.token_id,
            amount: e.nft_amount,
            amountAvailable: e.amount_available,
            price: e.nft_price,
            totalPrice: e.total_price,
            seller: e.nft_seller,
            owner: e.nft_owner,
            pinataData: e.pinata_data,
            name: e.metadata_name,
            description: e.metadata_description,
            tokenURI: e.token_uri,
            category: e.metadata_category,
            fileExtension: e.file_extension,
            fileSize: e.file_size,
            createdAt: e.created_at,
            likes: e.like,
          };
        }),
      );

      return items;
    } catch (error) {
      setError("Error while fetching listed NFTs");
      setOpenError(true);

      return [];
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
    fetchMyNFTsOrListedNFTs1155();
  }, []);

  const buyNFT = async (nft, token) => {
    try {
      const contract = await connectingWithSmartContract();
      const customTokenContract =
        await connectingWithCustomTokenSmartContract();
      const price = ethers.utils.parseUnits(nft.price.toString(), 18);

      const approval = await customTokenContract.approve(
        contract.address,
        price,
      );

      await approval.wait();

      const transaction = await contract.createMarketSale(nft.tokenId);

      await transaction.wait();

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

      const price = ethers.utils.parseUnits(nft.price.toString(), 18);
      const totalPrice = price.mul(BigNumber.from(quantity));

      const approval = await customTokenContract.approve(
        contract.address,
        totalPrice,
      );

      await approval.wait();

      const transaction = await contract.buyToken1155(nft.itemId, quantity);

      await transaction.wait();

      router.push("/author");
    } catch (error) {
      setError("Error while buying NFT");
      setOpenError(true);
    }
  };

  const [transactionCount, setTransactionCount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [tranferTokenWeb, setTranferTokenWeb] = useState([]);
  const [loading, setLoading] = useState(false);

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
          message,
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
            transaction.timestamp.toNumber() * 1000,
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

  const getAllWebTokenPurchaseHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tranfer-token-web/history`,
      );

      setTranferTokenWeb(response.data);
    } catch (error) {
      setError("Error while fetching purchase history");
      setOpenError(true);
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

  const checkRewardPool = async () => {
    try {
      const stakingContract = await connectingWithNftStakingSmartContract();

      const rewardPool = await stakingContract.rewardPool();

      return rewardPool.toString();
    } catch (error) {
      console.error("Error while checking reward pool:", error);
      setOpenError(true);
    }
  };

  const checkIfNFTIsStaked = async (account, tokenId) => {
    const stakingContract = await connectingWithNftStakingSmartContract();
    const userStakes = await stakingContract.getUserStakes(account);

    for (let stake of userStakes) {
      const id = stake.tokenId.toString();
      const isActive = stake.active;

      if (id === tokenId && isActive) {
        return true;
      }
    }

    return false;
  };

  const approveNFT721 = async (tokenId, address) => {
    try {
      const contract = await connectingWithSmartContract();

      const approvalTx = await contract.approve(address, tokenId);

      await approvalTx.wait();
    } catch (error) {
      console.error("Error while approving NFT:", error);

      setOpenError(true);
    }
  };

  const stakeNFT721 = async (tokenId, durationIndex) => {
    try {
      const stakingContract = await connectingWithNftStakingSmartContract();

      await approveNFT721(tokenId, stakingContract.address);

      const transaction = await stakingContract.stakeERC721(
        tokenId,
        durationIndex,
      );

      setLoading(true);

      transaction.wait();

      setLoading(false);
    } catch (error) {
      console.error("Error while staking NFT:", error);

      setOpenError(true);
    }
  };

  const fetchMyStakedNFTs = async (address) => {
    try {
      const stakingContract = await connectingWithNftStakingSmartContract();
      const userStakes = await stakingContract.getUserStakes(address);

      const activeStakes = userStakes.filter((stake) => stake.active);

      if (activeStakes.length === 0) return [];

      const contract = await connectingWithSmartContract();

      const items = await Promise.all(
        activeStakes.map(async (stake) => {
          console.log("stake", stake);
          const tokenURI = await contract.tokenURI(stake.tokenId);
          const { data } = await axios.get(tokenURI);
          const metadata = typeof data === "string" ? JSON.parse(data) : data;

          const calculateReward = () => {
            const currentTime = Date.now() / 1000;
            const timeStaked = currentTime - stake.startTime.toNumber();
            // const dayStaked = timeStaked / 86400;
            const dayStaked = timeStaked / 60;

            return stake.isERC721
              ? dayStaked * 10
              : dayStaked * stake.amount.toNumber();
          };

          return {
            stakeIndex: stake.stakeId.toNumber(),
            tokenId: stake.tokenId.toNumber(),
            amount: stake.amount.toNumber(),
            startTime: stake.startTime.toNumber(),
            endTime: stake.endTime.toNumber(),
            isERC721: stake.isERC721,
            name: metadata.name || `NFT #${stake.tokenId.toNumber()}`,
            pinataData: metadata.pinataData,
            estimatedReward: calculateReward(),
          };
        }),
      );

      return items;
    } catch (error) {
      console.error("Error while fetching staked NFTs:", error);
      return [];
    }
  };

  const unStakeNFT = async (stakeIndex, account, onSuccess) => {
    try {
      const stakingContract = await connectingWithNftStakingSmartContract();

      const count = await stakingContract.getUserStakesCount(account);

      if (stakeIndex >= count.toNumber() || stakeIndex < 0) {
        throw new Error(
          `Invalid stake ID: ${stakeIndex} (max: ${count.toNumber() - 1})`,
        );
      }

      const tx = await stakingContract.unstake(stakeIndex);

      setLoading(true);
      await tx.wait();
      setLoading(false);

      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (error) {
      let message = "Unstake failed";
      if (error.code === "CALL_EXCEPTION" || error.code === -32603) {
        const reason =
          error.error?.data?.message ||
          error.reason ||
          error.data?.message ||
          error.message;
        if (reason.includes("Not active"))
          message = "Stake already unstaked or inactive";
        else if (reason.includes("Insufficient reward pool"))
          message = "Reward pool insufficient";
        else if (reason.includes("Not staker"))
          message = "You are not the staker";
        else message = reason;
      } else if (error.message.includes("user rejected")) {
        message = "Transaction cancelled";
      }

      console.error("Error while unstaking NFT:", error);
      setError(message);
      setOpenError(true);
      return false;
    }
  };

  const getListingPrice = async () => {
    try {
      const contract = await connectingWithSmartContract();
      const price = await contract.getListingPrice();
      return price.toString();
    } catch (error) {
      console.error("Error fetching listing price:", error);
      return "0";
    }
  };

  const getOwnerTokenBalance = async () => {
    try {
      const customContract = await connectingWithCustomTokenSmartContract();
      const balance = await customContract.balanceOf(DeployerAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Error fetching owner balance:", error);
      return "0";
    }
  };

  const getTransferContractBalance = async () => {
    try {
      const transferContract = await connectToTransferTokenContract();
      const balance = await transferContract.getContractTokenBalance();
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Error fetching transfer contract balance:", error);
      return "0";
    }
  };

  const getBaseCoinRates = async () => {
    try {
      const transferContract = await connectToTransferTokenContract();
      const rates = {};
      const coins = ["ETH", "BNB", "SOL", "POL"];
      for (let coin of coins) {
        const rate = await transferContract.baseCoinRate(coin);
        rates[coin] = rate.toString();
      }
      return rates;
    } catch (error) {
      console.error("Error fetching base coin rates:", error);
      return {};
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/all-user`,
      );

      return response.data.allUser;
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
      setOpenError(true);
    }
  };

  const getTotalTransactionMarketplaceAll = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/total-transaction-marketplace-all`,
      );

      return {
        totalCount: response.data.data.totalCount,
        totalSpent: response.data.data.totalSpent,
      };
    } catch (error) {
      console.error("Error fetching total transactions:", error);
      setError("Failed to fetch total transactions");
      setOpenError(true);
    }
  };

  const updateListingPrice = async (newPrice) => {};

  const depositReward = async (amount) => {};

  const depositTokenToTransfer = async (amount) => {};

  const updateBaseCoinRate = async (coin, rate) => {};

  return (
    <NFTMarketplaceContext.Provider
      value={{
        checkIfWalletIsConnected,
        connectWallet,
        uploadToIPFS,
        createNFT,
        fetchNFTs,
        getSliderData,
        fetchNFTs1155,
        fetchMyNFTsOrListedNFTs,
        fetchMyNFTsOrListedNFTs1155,
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
        setShowNetworkModal,
        tranferToken,
        tokenBalance,
        tokenSymbol,
        createNFT1155,
        reSellToken1155,
        checkRewardPool,
        checkIfNFTIsStaked,
        stakeNFT721,
        fetchMyStakedNFTs,
        unStakeNFT,
        getAllWebTokenPurchaseHistory,
        tranferTokenWeb,
        getListingPrice,
        getOwnerTokenBalance,
        getTransferContractBalance,
        getBaseCoinRates,
        getAllUsers,
        getTotalTransactionMarketplaceAll,
        updateListingPrice,
        depositReward,
        depositTokenToTransfer,
        updateBaseCoinRate,
      }}
    >
      {children}

      <NetworkModal
        show={showNetworkModal}
        onClose={() => setShowNetworkModal(false)}
        onSelectNetwork={handleSelectNetwork}
        selectedNetwork={selectedNetwork}
      />
    </NFTMarketplaceContext.Provider>
  );
};
