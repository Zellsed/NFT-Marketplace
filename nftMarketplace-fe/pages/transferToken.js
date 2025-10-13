import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import Style from "../styles/transferFunds.module.css";
import StyleFrom from "../Ingredients/AccountPage/Form/Form.module.css";
import images from "../img";
import { FaEthereum, FaUserAlt } from "react-icons/fa";
import { Button, Loader } from "../Ingredients/components/componentsindex";

const TransferToken = () => {
  const {
    currentAccount,
    loading,
    accountBalance,
    baseCoinNetwork,
    tranferToken,
    depositToken,
  } = useContext(NFTMarketplaceContext);

  const [tranferAmount, setTranferAmount] = useState("");
  const [hasDeposited, setHasDeposited] = useState(false);
  const [openBox, setOpenBox] = useState(false);

  const isOwnerAddress =
    currentAccount?.toLowerCase() === process.env.NEXT_PUBLIC_OWNER_ADDRESS;

  const handleDeposit = async () => {
    try {
      await depositToken();
      setHasDeposited(true);
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  return (
    <div className={Style.transfer}>
      <div className={Style.transfer_box}>
        
        <h1>Transfer Token</h1>

        <div className={Style.transfer_box_box}>
          <div className={Style.transfer_box_box_left}>
            <Image
              src={images.transfer}
              alt="images"
              width={400}
              height={400}
            />
          </div>

          <div className={Style.transfer_box_box_right}>
            <h2>Now you can transfer token</h2>
            <div className={Style.transfer_box_box_right_info}>
              <p className={Style.transfer_box_box_right_info_deskTop}>
                Account: {currentAccount}
              </p>
              <p className={Style.transfer_box_box_right_info_mobile}>
                Account: {currentAccount?.slice(0, 30)}...
              </p>
              <p>
                Balance:{" "}
                <span style={{ whiteSpace: "nowrap" }}>
                  {accountBalance?.slice(0, 15)}... {baseCoinNetwork}
                </span>
              </p>
            </div>

            <div className={Style.transfer_box_box_right_box}>
              <div className={StyleFrom.Form_box_input}>
                <div className={StyleFrom.Form_box_input_box}>
                  <div className={StyleFrom.Form_box_input_box_icon}>
                    <FaEthereum />
                  </div>
                  <input
                    type="number"
                    min={1}
                    placeholder={baseCoinNetwork}
                    onChange={(e) => setTranferAmount(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <Loader />
              ) : (
                <Button
                  btnName="Transfer Token"
                  onClick={() => tranferToken(baseCoinNetwork, tranferAmount)}
                  classStyle={Style.button}
                />
              )}

              {isOwnerAddress && !hasDeposited && (
                <Button
                  btnName="Deposit Token"
                  onClick={() => handleDeposit()}
                  classStyle={`${Style.button} ${Style.depositButton}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferToken;
