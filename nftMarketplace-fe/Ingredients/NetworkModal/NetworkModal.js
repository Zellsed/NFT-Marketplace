import React from "react";
import Style from "./NetworkModal.module.css";

const NetworkModal = ({ show, onClose, onSelectNetwork, selectedNetwork }) => {
  const networks = [
    {
      name: "Ethereum Localhost",
      chainId: 31337,
      symbol: "ETH",
      rpcUrl: "https://127.0.0.1:8545",
      blockExplorer: "",
    },
    {
      name: "Ethereum Mainnet",
      chainId: 1,
      symbol: "ETH",
      rpcUrl: "https://mainnet.infura.io",
      blockExplorer: "https://etherscan.io",
    },
    {
      name: "Ethereum Hoodi",
      chainId: 560048,
      symbol: "ETH",
      rpcUrl: "https://hoodi.infura.io/v3/46a29745c9034ef89339cb8e2ed8f425",
      blockExplorer: "",
    },
    {
      name: "BNB Chain Mainnet",
      chainId: 56,
      symbol: "BNB",
      rpcUrl: "https://bsc-dataseed.binance.org",
      blockExplorer: "https://bscscan.com",
    },
    {
      name: "BNB Chain Testnet",
      chainId: 97,
      symbol: "BNB",
      rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
      blockExplorer: "https://testnet.bscscan.com",
    },
    {
      name: "Polygon Mainnet",
      chainId: 137,
      symbol: "POL",
      rpcUrl: "https://polygon-mainnet.infura.io",
      blockExplorer: "https://polygonscan.com",
    },
    {
      name: "Polygon Amoy",
      chainId: 80002,
      symbol: "POL",
      rpcUrl:
        "https://polygon-amoy.infura.io/v3/46a29745c9034ef89339cb8e2ed8f425",
    },
  ];

  if (!show) return null;

  return (
    <div className={Style.modalOverlay} onClick={onClose}>
      <div className={Style.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={Style.modalHeader}>
          <h2>Select Network</h2>
          <button className={Style.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={Style.networkList}>
          {networks.map((network) => (
            <div
              key={network.chainId}
              className={`${Style.networkItem} ${
                selectedNetwork?.chainId === network.chainId
                  ? Style.selected
                  : ""
              }`}
              onClick={() => onSelectNetwork(network)}
            >
              <div className={Style.networkInfo}>
                <div className={Style.networkName}>{network.name}</div>
                <div className={Style.networkDetails}>
                  Chain ID: {network.chainId} • {network.symbol}
                </div>
              </div>
              {selectedNetwork?.chainId === network.chainId && (
                <div className={Style.selectedIndicator}>✓</div>
              )}
            </div>
          ))}
        </div>

        <div className={Style.modalFooter}>
          <button className={Style.confirmButton} onClick={onClose}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkModal;
