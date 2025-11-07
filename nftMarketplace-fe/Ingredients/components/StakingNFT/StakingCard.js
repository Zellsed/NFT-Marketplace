import { formatDistanceToNow } from "date-fns";
import Style from "../../../styles/Staking.module.css";
import axios from "axios";

export default function StakingCard({ stake, onUnstake }) {
  console.log("StakingCard stake:", stake);
  const isLocked = Date.now() / 1000 < stake.endTime;
  const timeLeft = isLocked
    ? formatDistanceToNow(new Date(stake.endTime * 1000), { addSuffix: true })
    : "Unlocked";

  return (
    <div
      className={`${Style.staking_card} ${
        isLocked ? Style.staking_card_locked : ""
      }`}
    >
      <div className={Style.nft_image}>
        <img
          src={stake.pinataData || "/placeholder-nft.png"}
          alt={stake.name}
        />
      </div>

      <div className={Style.nft_info}>
        <h3>{stake.name || `NFT #${stake.tokenId}`}</h3>
        <p className={Style.token_id}>ID: {stake.tokenId.toString()}</p>
        <p className={Style.amount}>Amount: {stake.amount.toNumber()}</p>
      </div>

      <div className={Style.stake_details}>
        <p>
          <strong>Staked:</strong>{" "}
          {new Date(stake.startTime * 1000).toLocaleDateString()}
        </p>
        <p>
          <strong>Unlock:</strong> {timeLeft}
        </p>
      </div>

      <div className={Style.reward}>
        <p>
          <strong>Reward:</strong> ~{stake.estimatedReward?.toFixed(2) || "0"}{" "}
          WEB
        </p>
      </div>

      <button
        onClick={onUnstake}
        className={`${Style.unstake_btn} ${
          isLocked ? Style.unstake_btn_early : ""
        }`}
      >
        {isLocked ? "Early Unstake" : "Unstake"}
      </button>

      {isLocked && (
        <p className={Style.penalty_note}>Early unstake: 50% penalty</p>
      )}
    </div>
  );
}
