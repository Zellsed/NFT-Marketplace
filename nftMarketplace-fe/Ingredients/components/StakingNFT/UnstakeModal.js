import { useState } from "react";

export default function UnstakeModal({ isOpen, stake, onClose, onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !stake) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(stake.stakeIndex);
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* <h2>Confirm Unstake</h2> */}
        <h2>{isEarly ? "Early Unstake" : "Confirm Unstake"}</h2>

        <div className="modal-nft">
          <img src={stake.image || "/placeholder-nft.png"} alt="NFT" />
          <div>
            <p>
              <strong>{stake.name || `NFT #${stake.tokenId}`}</strong>
            </p>
            <p>Original Reward: ~{stake.estimatedReward?.toFixed(2)} WEB</p>
            {isEarly && (
              <>
                <p className="penalty">Penalty: -50%</p>
                <p className="final-reward">
                  Final Reward: ~{finalReward.toFixed(2)} WEB
                </p>
              </>
            )}
          </div>
        </div>

        {isEarly && (
          <div className="warning-message">
            <p>
              ⚠️ You are unstaking early! You will receive only 50% of your
              rewards.
            </p>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`btn-confirm ${isEarly ? "btn-confirm-warning" : ""}`}
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
