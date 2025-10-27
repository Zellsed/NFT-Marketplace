// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

import "hardhat/console.sol";

interface INFTCollection1155 {
    function createCollection(
        string memory uri,
        uint256 totalSupply
    ) external returns (uint256);
}

contract NFTMarketplace is ERC721URIStorage, ERC1155Receiver {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemIds1155;

    uint256 listingPrice = 25; // 25 WEB

    address private owner;
    IERC20 public webToken;
    address public immutable nftCollection1155;

    mapping(uint256 => MarketItem) private idMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event idMarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    struct MarketItem1155 {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        uint256 amount;
        uint256 price;
        address payable seller;
        bool sold;
    }

    mapping(uint256 => MarketItem1155) private idMarketItem1155;

    event MarketItem1155Created(
        uint256 indexed itemId,
        uint256 tokenId,
        uint256 amount,
        uint256 price,
        address seller
    );

    constructor(
        address _webTokenAddress,
        address _nftCollection1155Address
    ) ERC721("NFT Metavarse Token", "NFTMT") {
        owner = payable(msg.sender);
        webToken = IERC20(_webTokenAddress);
        nftCollection1155 = _nftCollection1155Address;
    }

    function updateListingPrice(uint256 _listingPrice) public {
        require(msg.sender == owner, "Only owner can update listing price");
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createToken(
        string memory _tokenURI,
        uint256 _price
    ) public returns (uint256) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        createMarketItem(newTokenId, _price);

        return newTokenId;
    }

    function createToken1155(
        string memory _uri,
        uint256 _totalSupply,
        uint256 _pricePerToken
    ) external returns (uint256 itemId) {
        require(_totalSupply > 0, "Supply > 0");
        require(_pricePerToken > 0, "Price > 0");

        uint256 tokenId = INFTCollection1155(nftCollection1155)
            .createCollection(_uri, _totalSupply);

        itemId = createMarketItem1155(tokenId, _totalSupply, _pricePerToken);

        return itemId;
    }

    function createMarketItem(uint256 _tokenId, uint256 _price) private {
        require(_price > 0, "Price must be al lest 1");

        bool success = webToken.transferFrom(
            msg.sender,
            address(this),
            listingPrice
        );
        require(success, "Token transfer failed for listing price");

        idMarketItem[_tokenId] = MarketItem(
            _tokenId,
            payable(msg.sender),
            payable(address(this)),
            _price,
            false
        );

        _transfer(msg.sender, address(this), _tokenId);

        emit idMarketItemCreated(
            _tokenId,
            msg.sender,
            address(this),
            _price,
            false
        );
    }

    function createMarketItem1155(
        uint256 _tokenId,
        uint256 _amount,
        uint256 _pricePerToken
    ) private returns (uint256 itemId) {
        IERC1155(nftCollection1155).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            _amount,
            ""
        );

        bool success = webToken.transferFrom(
            msg.sender,
            address(this),
            listingPrice
        );
        require(success, "Listing fee failed");

        _itemIds1155.increment();
        itemId = _itemIds1155.current();

        idMarketItem1155[itemId] = MarketItem1155({
            itemId: itemId,
            nftContract: nftCollection1155,
            tokenId: _tokenId,
            amount: _amount,
            price: _pricePerToken,
            seller: payable(msg.sender),
            sold: false
        });

        emit MarketItem1155Created(
            itemId,
            _tokenId,
            _amount,
            _pricePerToken,
            msg.sender
        );

        return itemId;
    }

    function reSellToken(uint256 _tokenId, uint256 _price) public {
        require(
            idMarketItem[_tokenId].owner == msg.sender,
            "Only item owner con perform this operation"
        );

        bool success = webToken.transferFrom(
            msg.sender,
            address(this),
            listingPrice
        );
        require(success, "Token transfer failed for listing fee");

        idMarketItem[_tokenId].sold = false;
        idMarketItem[_tokenId].price = _price;
        idMarketItem[_tokenId].seller = payable(msg.sender);
        idMarketItem[_tokenId].owner = payable(address(this));

        _itemsSold.decrement();

        _transfer(msg.sender, address(this), _tokenId);
    }

    function createMarketSale(uint256 _tokenId) public {
        uint256 price = idMarketItem[_tokenId].price / 1 ether;

        bool success = webToken.transferFrom(msg.sender, address(this), price);
        require(success, "Token transfer failed for NFT price");

        webToken.transfer(owner, listingPrice);

        uint256 sellerProceeds = price;

        webToken.transfer(idMarketItem[_tokenId].seller, sellerProceeds);

        idMarketItem[_tokenId].owner = payable(msg.sender);
        idMarketItem[_tokenId].sold = true;
        idMarketItem[_tokenId].seller = payable(address(0));

        _itemsSold.increment();

        _transfer(address(this), msg.sender, _tokenId);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unSoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unSoldItemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            if (idMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;

                MarketItem storage currentItem = idMarketItem[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMarketItems1155()
        public
        view
        returns (MarketItem1155[] memory)
    {
        uint256 itemCount = _itemIds1155.current();
        uint256 unsoldCount = 0;

        for (uint256 i = 1; i <= itemCount; i++) {
            if (!idMarketItem1155[i].sold) {
                unsoldCount++;
            }
        }

        MarketItem1155[] memory items = new MarketItem1155[](unsoldCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= itemCount; i++) {
            if (!idMarketItem1155[i].sold) {
                items[currentIndex] = idMarketItem1155[i];
                currentIndex++;
            }
        }

        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;

                MarketItem storage currentItem = idMarketItem[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalCount; i++) {
            if (idMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;

                MarketItem storage currentItem = idMarketItem[currentId];

                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        virtual
        override(ERC721URIStorage, ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
