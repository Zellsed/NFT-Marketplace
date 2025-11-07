// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTStaking is IERC721Receiver {
  IERC20 public webToken;
  address public nft721Contract;
  address public nft1155Contract;
  address private owner;

  uint256 public constant DAY_IN_SECONDS = 86400;
  uint256[3] public durations = [30 * DAY_IN_SECONDS, 60 * DAY_IN_SECONDS, 90 * DAY_IN_SECONDS];

  struct StakeInfo {
    address staker;
    uint256 startTime;
    uint256 endTime;
    uint256 amount;
    uint256 tokenId;
    bool isERC721;
    bool active;
  }

  mapping(address => StakeInfo[]) public userStakes;
  uint256 public totalStakedValue;
  uint256 public rewardPool;

  event Staked(address staker, uint256 tokenId, uint256 amount, uint256 duration);
  event Unstaked(address staker, uint256 tokenId, uint256 amount, uint256 reward);

  constructor(address _webToken, address _nft721Contract, address _nft1155Contract) {
    owner = payable(msg.sender);
    webToken = IERC20(_webToken);
    nft721Contract = _nft721Contract;
    nft1155Contract = _nft1155Contract;
  }

  function depositReward(uint256 _amount) external {
    require(msg.sender == owner, "Ownable: caller is not the owner");
    webToken.transferFrom(msg.sender, address(this), _amount);
    rewardPool += _amount;
  }

  function stakeERC721(uint256 _tokenId, uint8 _durationIndex) external {
    require(_durationIndex < 3, "Invalid duration");
    require(IERC721(nft721Contract).ownerOf(_tokenId) == msg.sender, "Not owner of NFT");

    IERC721(nft721Contract).safeTransferFrom(msg.sender, address(this), _tokenId);

    uint256 endTime = block.timestamp + durations[_durationIndex];

    userStakes[msg.sender].push(StakeInfo({
      staker: msg.sender,
      startTime: block.timestamp,
      endTime: endTime,
      amount: 1,
      tokenId: _tokenId,
      isERC721: true,
      active: true
    }));

    emit Staked(msg.sender, _tokenId, 1, durations[_durationIndex]);
  }

  function stakeERC1155(uint256 _tokenId, uint256 _amount, uint8 _durationIndex) external {
    require(_durationIndex < 3, "Invalid duration");
    require(IERC1155(nft1155Contract).balanceOf(msg.sender, _tokenId) >= _amount, "Insufficient balance");

    IERC1155(nft1155Contract).safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");

    uint256 endTime = block.timestamp + durations[_durationIndex];

    userStakes[msg.sender].push(StakeInfo({
      staker: msg.sender,
      startTime: block.timestamp,
      endTime: endTime,
      amount: _amount,
      tokenId: _tokenId,
      isERC721: false,
      active: true
    }));

    emit Staked(msg.sender, _tokenId, _amount, durations[_durationIndex]);
  }

  function unstake(uint256 _stakeIndex) external {
    StakeInfo memory stake = userStakes[msg.sender][_stakeIndex];

    require(stake.active, "Not active");

    uint256 currentTime = block.timestamp;
    bool isEarly = currentTime < stake.endTime;

    uint256 timeStaked = currentTime - stake.startTime;
    uint256 dayStaked = timeStaked / DAY_IN_SECONDS;

    uint256 reward = 0;

    if (stake.isERC721) {
      uint256 baseRewardPerDay = 10; // 10 WEB per day
      reward = baseRewardPerDay * dayStaked; 
    } else {
      uint256 rewardPerTokenPerDay = 1; // 1 WEB per day
      reward = rewardPerTokenPerDay * stake.amount * dayStaked; 
    }

    if (isEarly) {
      reward = reward / 2;
    }

    require(rewardPool >= reward, "Insufficient reward pool");

    if (stake.isERC721) {
      IERC721(nft721Contract).safeTransferFrom(address(this), msg.sender, stake.tokenId);
    } else {
      IERC1155(nft1155Contract).safeTransferFrom(address(this), msg.sender, stake.tokenId, stake.amount, "");
    }

    webToken.transfer(msg.sender, reward);
    rewardPool -= reward;
    stake.active = false;

    emit Unstaked(msg.sender, stake.tokenId, stake.amount, reward);
  }

  function getUserStakes(address _user) external view returns (StakeInfo[] memory) {
    return userStakes[_user];
  }

  function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}