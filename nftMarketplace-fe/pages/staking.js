// pages/staking/index.js
import { useContext, useState, useEffect } from "react";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import StakingCard from "./components/StakingCard";
import UnstakeModal from "./components/UnstakeModal";

export default function StakingPage() {
  const { currentAccount, fetchMyStakedNFTs, unstakeNFT } = useContext(
    NFTMarketplaceContext
  );
  const [stakedNFTs, setStakedNFTs] = useState([]);
  const [selectedStake, setSelectedStake] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (currentAccount) {
      loadStakedNFTs();
    }
  }, [currentAccount]);

  const loadStakedNFTs = async () => {
    const stakes = await fetchMyStakedNFTs();
    setStakedNFTs(stakes);
  };

  const handleUnstake = (stake) => {
    setSelectedStake(stake);
    setIsModalOpen(true);
  };

  return (
    <div className="staking-page">
      <h1>Stake Your NFTs & Earn WEB</h1>

      <div className="stats">
        <div>Total Staked: {stakedNFTs.length}</div>
        <div>Reward Pool: 1,250,000 WEB</div>
      </div>

      <div className="staking-grid">
        {stakedNFTs.length === 0 ? (
          <p>
            No NFTs staked. <Link href="/my-nfts">Go stake now!</Link>
          </p>
        ) : (
          stakedNFTs.map((stake, i) => (
            <StakingCard
              key={i}
              stake={stake}
              onUnstake={() => handleUnstake(stake)}
            />
          ))
        )}
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
