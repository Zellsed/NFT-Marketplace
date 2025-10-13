// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CustomToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 10000000 * 10 ** 18);
    }
}

contract TranferToken {
    IERC20 public webToken;

    address public owner;

    string[] public tokens = ["ETH", "BNB", "SOL"];

    mapping(string => uint256) public baseCoinRate;
    
    mapping(address => uint256) public userPurchasedBalance;
    
    uint256 public contractTokenBalance;

    struct History {
        uint256 id;
        address userAddress;
        string action;
        string baseCoin;
        uint256 baseCoinAmount;
        uint256 webTokenAmount;
        uint256 timestamp;
    }

    uint256 public _historyIndex;
    mapping(uint256 => History) private histories;

    constructor(address _webTokenAddress) {
        webToken = IERC20(_webTokenAddress);
        owner = msg.sender;

        baseCoinRate["ETH"] = 3846;
        baseCoinRate["BNB"] = 1164;
        baseCoinRate["SOL"] = 184;

        contractTokenBalance = 0;
    }

    function depositToken(uint256 amount) external {
        bool success = webToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");
        
        contractTokenBalance += amount;
    }

    function getContractTokenBalance() public view returns (uint256) {
        return contractTokenBalance;
    }

    function getUserPurchasedBalance(address userAddress) public view returns (uint256) {
        return userPurchasedBalance[userAddress];
    }

    function getUserActualBalance(address userAddress) public view returns (uint256) {
        return webToken.balanceOf(userAddress);
    }

    function buyWebTokenWithBaseCoin(string memory _baseCoin) external payable {
        require(msg.value > 0, "Amount must be greater than 0");

        uint256 webAmount = (msg.value / 1 ether) * baseCoinRate[_baseCoin];

        require(
            contractTokenBalance >= webAmount,
            "Insufficient contract balance"
        );

        bool success = webToken.transfer(msg.sender, webAmount);
        require(success, "Token transfer failed");

        contractTokenBalance -= webAmount;
        userPurchasedBalance[msg.sender] += webAmount;

        _recordHistory("BUY", _baseCoin, msg.value, webAmount);
    }

    function _recordHistory(
        string memory _action, 
        string memory _baseCoin, 
        uint256 _baseCoinAmount, 
        uint256 _webAmount) internal {
            _historyIndex++;

            histories[_historyIndex] = History({
                id: _historyIndex,
                userAddress: msg.sender,
                action: _action,
                baseCoin: _baseCoin,
                baseCoinAmount: _baseCoinAmount,
                webTokenAmount: _webAmount,
                timestamp: block.timestamp
            });
    }
}
