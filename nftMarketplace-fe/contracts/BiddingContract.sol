// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IERC721 {
    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract NftAuction {
    uint256 private constant duration = 7;

    IERC721 public nft;
    uint256 public nftId;

    address payable public seller;
    uint256 public startingPrice;
    uint256 public discountRate;
    uint256 public startAt;
    uint256 public expiresAt;

    constructor(
        uint256 _startingPrice,
        uint256 _discountRate,
        address _nft,
        uint256 _nftId
    ) {
        seller = payable(msg.sender);
        startingPrice = _startingPrice;
        discountRate = _discountRate;
        startAt = block.timestamp;
        expiresAt = block.timestamp + duration;

        require(_startingPrice >= _discountRate + duration, "Invalid price");

        nft = IERC721(_nft);
        nftId = _nftId;
    }

    function getPrice() public view returns (uint256) {
        uint256 timeElapsed = block.timestamp - startAt;
        uint256 discount = discountRate * timeElapsed;

        return startingPrice - discount;
    }

    function buy() external payable {
        require(block.timestamp < expiresAt, "Expired");

        uint256 price = getPrice();
        require(msg.value >= price, "Insufficient funds");

        nft.transferFrom(seller, msg.sender, nftId);

        uint256 refund = msg.value - price;

        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }

        selfdestruct(seller);
    }
}
