// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomToken is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 10000000 * 10 ** 18);
    }
}

contract CustomDex {
    string[] public tokens = ["ETH", "BNB", "SOL", "TON"];

    mapping(string => ERC20) public tokenInstanceMap;
    mapping(string => uint256) public baseCoinRate;

    struct History {
        uint256 historyId;
        string tokenA;
        string tokenB;
        uint256 inputValue;
        uint256 outputValue;
        address userAddress;
    }

    uint256 public _historyIndex;
    mapping(uint256 => History) private historys;

    constructor() {
        for (uint i = 0; i < tokens.length; i++) {
            CustomToken token = new CustomToken(tokens[i], tokens[i]);
            tokenInstanceMap[tokens[i]] = token;
        }

        baseCoinRate["ETH"] = 100000000000000; // 0.0001 ETH
        baseCoinRate["BNB"] = 50000000000000; // 0.00005 BNB
        baseCoinRate["SOL"] = 20000000000000; // 0.00002 SOL
        baseCoinRate["TON"] = 10000000000000; // 0.00001 TON
    }

    function getBalance(
        string memory tokenName,
        address _address
    ) public view returns (uint256) {
        return tokenInstanceMap[tokenName].balanceOf(_address);
    }

    function getTotalSupply(
        string memory tokenName
    ) public view returns (uint256) {
        return tokenInstanceMap[tokenName].totalSupply();
    }

    function getName(
        string memory tokenName
    ) public view returns (string memory) {
        return tokenInstanceMap[tokenName].name();
    }

    function getTokenAddress(
        string memory tokenName
    ) public view returns (address) {
        return address(tokenInstanceMap[tokenName]);
    }

    function getEthBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function _transactionHistory(
        string memory tokenName,
        string memory etherToken,
        uint256 inputValue,
        uint256 outputValue
    ) internal {
        _historyIndex++;
        uint256 _historyId = _historyIndex;
        History storage history = historys[_historyId];

        history.historyId = _historyId;
        history.userAddress = msg.sender;
        history.tokenA = tokenName;
        history.tokenB = etherToken;
        history.inputValue = inputValue;
        history.outputValue = outputValue;
    }

    function swapBaseToToken(
        string memory baseCoin,
        string memory tokenName
    ) public payable returns (uint256) {
        require(baseCoinRate[baseCoin] > 0, "Invalid base coin");

        uint256 inputValue = msg.value;
        uint256 outputValue = (inputValue / baseCoinRate[baseCoin]) * 10 ** 18;

        require(
            tokenInstanceMap[tokenName].transfer(msg.sender, outputValue),
            "Token transfer failed"
        );

        string memory etherToken = "Ether";
        _transactionHistory(tokenName, etherToken, inputValue, outputValue);

        return outputValue;
    }

    function swapTokenToBase(
        string memory tokenName,
        string memory baseCoin,
        uint256 _amount
    ) public returns (uint256) {
        require(baseCoinRate[baseCoin] > 0, "Invalid base coin");

        uint256 exactAmount = _amount / 10 ** 18;
        uint256 ethToBeTransferred = exactAmount * baseCoinRate[baseCoin];

        require(
            address(this).balance >= ethToBeTransferred,
            "Insufficient contract balance"
        );

        payable(msg.sender).transfer(ethToBeTransferred);
        require(
            tokenInstanceMap[tokenName].transferFrom(
                msg.sender,
                address(this),
                _amount
            ),
            "Token transfer failed"
        );

        string memory etherToken = "Ether";
        _transactionHistory(
            tokenName,
            etherToken,
            exactAmount,
            ethToBeTransferred
        );

        return ethToBeTransferred;
    }

    function getAllHistory() public view returns (History[] memory) {
        uint256 itemCount = _historyIndex;
        uint256 currentIndex = 0;

        History[] memory items = new History[](itemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 currentId = i + 1;
            History storage currentItem = historys[currentId];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }
}
