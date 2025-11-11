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

    // uint256 public constant DAY_IN_SECONDS = 86400;
    // uint256[3] public durations = [30 * DAY_IN_SECONDS, 60 * DAY_IN_SECONDS, 90 * DAY_IN_SECONDS];

    uint256 public constant DAY_IN_SECONDS = 60;
    uint256[3] public durations = [
        30 * DAY_IN_SECONDS,
        60 * DAY_IN_SECONDS,
        90 * DAY_IN_SECONDS
    ];

    struct StakeInfo {
        uint256 stakeId;
        address staker;
        uint256 startTime;
        uint256 endTime;
        uint256 amount;
        uint256 tokenId;
        bool isERC721;
        bool active;
    }

    mapping(address => mapping(uint256 => StakeInfo)) public userStakes;
    mapping(address => uint256) public userStakeCount;
    uint256 public rewardPool;

    event Staked(
        address indexed staker,
        uint256 indexed stakeId,
        uint256 tokenId,
        uint256 amount,
        uint256 duration
    );
    event Unstaked(
        address indexed staker,
        uint256 indexed stakeId,
        uint256 tokenId,
        uint256 amount,
        uint256 reward
    );
    event RewardDeposited(address indexed owner, uint256 amount);

    constructor(
        address _webToken,
        address _nft721Contract,
        address _nft1155Contract
    ) {
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
        require(
            IERC721(nft721Contract).ownerOf(_tokenId) == msg.sender,
            "Not owner of NFT"
        );

        IERC721(nft721Contract).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        uint256 stakeId = userStakeCount[msg.sender]++;
        uint256 endTime = block.timestamp + durations[_durationIndex];

        userStakes[msg.sender][stakeId] = StakeInfo({
            stakeId: stakeId,
            staker: msg.sender,
            startTime: block.timestamp,
            endTime: endTime,
            amount: 1,
            tokenId: _tokenId,
            isERC721: true,
            active: true
        });

        emit Staked(msg.sender, stakeId,  _tokenId, 1, durations[_durationIndex]);
    }

    function stakeERC1155(
        uint256 _tokenId,
        uint256 _amount,
        uint8 _durationIndex
    ) external {
        require(_durationIndex < 3, "Invalid duration");
        require(
            IERC1155(nft1155Contract).balanceOf(msg.sender, _tokenId) >=
                _amount,
            "Insufficient balance"
        );

        IERC1155(nft1155Contract).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId,
            _amount,
            ""
        );

        uint256 stakeId = userStakeCount[msg.sender]++;
        uint256 endTime = block.timestamp + durations[_durationIndex];

        userStakes[msg.sender][stakeId] = StakeInfo({
            stakeId: stakeId,
            staker: msg.sender,
            startTime: block.timestamp,
            endTime: endTime,
            amount: _amount,
            tokenId: _tokenId,
            isERC721: false,
            active: true
        });

        emit Staked(msg.sender, stakeId, _tokenId, _amount, durations[_durationIndex]);
    }

    function unstake(uint256 _stakeId) external {
        StakeInfo storage stake = userStakes[msg.sender][_stakeId];
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
            IERC721(nft721Contract).safeTransferFrom(
                address(this),
                msg.sender,
                stake.tokenId
            );
        } else {
            IERC1155(nft1155Contract).safeTransferFrom(
                address(this),
                msg.sender,
                stake.tokenId,
                stake.amount,
                ""
            );
        }

        webToken.transfer(msg.sender, reward);
        rewardPool -= reward;
        stake.active = false;

        emit Unstaked(msg.sender, _stakeId, stake.tokenId, stake.amount, reward);
    }

    function getUserStakes(
        address _user
    ) external view returns (StakeInfo[] memory) {
        uint256 total = userStakeCount[_user];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < total; i++) {
            if (userStakes[_user][i].active) activeCount++;
        }

        StakeInfo[] memory activeStakes = new StakeInfo[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < total; i++) {
            if (userStakes[_user][i].active) {
                activeStakes[index] = userStakes[_user][i];
                index++;
            }
        }
        return activeStakes;
    }

    function getUserStakesCount(address _user) external view returns (uint256) {
        return userStakeCount[_user];
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
