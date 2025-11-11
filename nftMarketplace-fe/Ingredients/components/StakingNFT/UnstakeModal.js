import { useState } from "react";
import Style from "../../../styles/Staking.module.css";

export default function UnstakeModal({
  account,
  isOpen,
  stake,
  onClose,
  onConfirm,
  onSuccess = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !stake) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const success = await onConfirm(stake.stakeIndex, account);
      if (success) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error("Unstake failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isEarly = Date.now() / 1000 < stake.endTime;
  const penalty = isEarly ? 50 : 0;

  const calculatePenaltyReward = () => {
    if (!stake.estimatedReward) return 0;
    const reward = parseFloat(stake.estimatedReward);
    return isEarly ? reward * 0.5 : reward;
  };

  const finalReward = calculatePenaltyReward();

  return (
    <div className={Style.modal_overlay} onClick={onClose}>
      <div className={Style.modal_content} onClick={(e) => e.stopPropagation()}>
        <h2>{isEarly ? "Early Unstake" : "Confirm Unstake"}</h2>

        <div className={Style.modal_nft}>
          <img src={stake.pinataData || "/placeholder-nft.png"} alt="NFT" />
          <div>
            <p>
              <strong>{stake.name || `NFT #${stake.tokenId}`}</strong>
            </p>
            <p>Original Reward: ~{stake.estimatedReward?.toFixed(2)} WEB</p>
            {isEarly && (
              <>
                <p className={Style.penalty}>Penalty: -50%</p>
                <p className={Style.final_reward}>
                  Final Reward: ~{finalReward.toFixed(2)} WEB
                </p>
              </>
            )}
          </div>
        </div>

        {isEarly && (
          <div className={Style.warning_message}>
            <p>
              ⚠️ You are unstaking early! You will receive only 50% of your
              rewards.
            </p>
          </div>
        )}

        <div className={Style.modal_actions}>
          <button onClick={onClose} className={Style.btn_cancel}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`${Style.btn_confirm} ${
              isEarly ? Style.btn_confirm_warning : ""
            }`}
          >
            {isLoading
              ? "Processing..."
              : isEarly
              ? "Confirm Early Unstake"
              : "Confirm Unstake"}
          </button>
        </div>
      </div>
    </div>
  );
}
