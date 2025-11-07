import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import StakingCard from "../Ingredients/components/StakingNFT/StakingCard";
import UnstakeModal from "../Ingredients/components/StakingNFT/UnstakeModal";
import Style from "../styles/Staking.module.css";

export default function StakingPage() {
  const { currentAccount, checkRewardPool, fetchMyStakedNFTs, unstakeNFT } =
    useContext(NFTMarketplaceContext);
  const [stakedNFTs, setStakedNFTs] = useState([]);
  const [selectedStake, setSelectedStake] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rewardPool, setRewardPool] = useState(0);

  useEffect(() => {
    if (currentAccount) {
      loadStakedNFTs();
    }
  }, [currentAccount]);

  useEffect(() => {
    fetchRewardPool();
  }, []);

  const loadStakedNFTs = async () => {
    try {
      const stakes = await fetchMyStakedNFTs(currentAccount);
      setStakedNFTs(stakes);
    } catch (err) {
      console.error("Failed to load staked NFTs:", err);
    }
  };

  const fetchRewardPool = async () => {
    try {
      const balance = await checkRewardPool();
      setRewardPool(balance);
    } catch (err) {
      console.error("Failed to fetch reward pool:", err);
      setRewardPool(0);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    return new Intl.NumberFormat().format(num);
  };

  const handleUnstake = (stake) => {
    setSelectedStake(stake);
    setIsModalOpen(true);
  };

  return (
    <div className={Style.staking_page}>
      <div className={Style.header}>
        <h1>Stake Your NFTs & Earn WEB</h1>
        <br />
        <p>Lock your NFTs to earn passive rewards</p>
        <br />
        <p>TOKEN WEB - ( ZELL )</p>
      </div>

      <div className={Style.spacing_section}>
        <div className={Style.stats}>
          <div className={Style.stat_item}>
            <span>Total Staked</span>
            <strong>{stakedNFTs.length} NFTs</strong>
          </div>
          <div className={Style.stat_item}>
            <span>Reward Pool</span>
            <strong>{formatNumber(rewardPool)} WEB</strong>
          </div>
        </div>
      </div>

      <div className={Style.staking_content}>
        <div className={Style.staking_grid}>
          {stakedNFTs.length === 0 ? (
            <div className={Style.empty_state}>
              <p>No NFTs staked yet.</p>
              <Link href="/author">
                <button className={Style.go_stake_btn}>Go Stake Now</button>
              </Link>
            </div>
          ) : (
            stakedNFTs.map((stake, i) => (
              <StakingCard
                key={i}
                stake={stake}
                onUnstake={() => handleUnstake({ ...stake, stakeIndex: i })}
              />
            ))
          )}
        </div>
      </div>

      <UnstakeModal
        isOpen={isModalOpen}
        stake={selectedStake}
        onClose={() => setIsModalOpen(false)}
        onConfirm={unstakeNFT}
      />
    </div>
  );
}
