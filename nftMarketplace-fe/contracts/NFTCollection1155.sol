// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract NFTCollection1155 is ERC1155 {
    uint256 public currentTokenId = 0;

    struct CollectionInfo {
        uint256 totalSupply;
        uint256 minted;
        string uri;
    }

    mapping(uint256 => CollectionInfo) public collections;

    constructor() ERC1155("") {}

    function createCollectionForMarketplace(
        string memory _uri,
        uint256 _supply,
        address marketplace
    ) external returns (uint256) {
        currentTokenId++;
        collections[currentTokenId] = CollectionInfo({
            totalSupply: _supply,
            minted: _supply,
            uri: _uri
        });
        _mint(marketplace, currentTokenId, _supply, "");
        return currentTokenId;
    }

    function createCollection(string memory _uri, uint256 _supply) external returns (uint256) {
        currentTokenId++;
        collections[currentTokenId] = CollectionInfo({
            totalSupply: _supply,
            minted: _supply,
            uri: _uri
        });
        _mint(msg.sender, currentTokenId, _supply, "");
        return currentTokenId;
    }

    function uri(uint256 id) public view override returns (string memory) {
        return collections[id].uri;
    }
}
