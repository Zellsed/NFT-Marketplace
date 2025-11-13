import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import Style from "../styles/transferFunds.module.css";
import StyleFrom from "../Ingredients/AccountPage/Form/Form.module.css";
import images from "../img";
import { FaEthereum, FaUserAlt, FaBitcoin } from "react-icons/fa";
import { Button, Loader } from "../Ingredients/components/componentsindex";

const TransferToken = () => {
  const {
    currentAccount,
    loading,
    accountBalance,
    baseCoinNetwork,
    tranferToken,
    getAllWebTokenPurchaseHistory,
    tranferTokenWeb,
  } = useContext(NFTMarketplaceContext);

  const [tranferAmount, setTranferAmount] = useState("");

  useEffect(() => {
    getAllWebTokenPurchaseHistory();
  }, []);

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
                    <FaBitcoin />
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
                  btnName="Buy Token WEB"
                  onClick={() => tranferToken(baseCoinNetwork, tranferAmount)}
                  classStyle={Style.button}
                />
              )}
            </div>
          </div>
        </div>

        <h1 className={Style.transfer_box_h1}>Web Token Purchase History</h1>
        <p>
          The Web Token purchase history provides a detailed record of all token
          transactions made by users on the platform. Each entry includes
          essential information such as the transaction ID, token amount,
          purchase date, payment method, and transaction status. This history
          helps users easily track their spending, verify completed purchases,
          and maintain transparency in their digital asset management. It also
          serves as an important reference for auditing and customer support,
          ensuring users have full control and visibility over their
          token-related activities.
        </p>

        {/* <div className={Style.transfer_box_history}>
          {tranferTokenWeb.map((el, i) => (
            <div className={Style.transfer_box_history_item} key={i + 1}>
              <Image
                src={images.ethereTransfer}
                width={200}
                height={200}
                alt="image"
              />

              <div className={Style.transfer_box_history_item_info}>
                <p>
                  {" "}
                  <span>Transfer ID:</span> #{el.id}
                </p>
                <p>
                  <span>User Address:</span>{" "}
                  {`${el.userAddress.slice(0, 16)}...${el.userAddress.slice(
                    -5
                  )}`}
                </p>
                <p>
                  <span>Base Coin Amount:</span> {el.baseCoinAmount}{" "}
                  {el.baseCoin}
                </p>
                <p>
                  <span>Web Token Amount:</span> {el.webTokenAmount} WEB
                </p>
                <span>
                  {new Date(el.createdAt).toLocaleString("vi-VN", {
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div> */}
        <div className={Style.transfer_box_history}>
          {tranferTokenWeb.map((el, i) => (
            <div className={Style.transfer_box_history_item} key={i + 1}>
              <Image
                src={images.ethereTransfer}
                width={120}
                height={120}
                alt="transaction"
                className={Style.transfer_history_image}
              />

              <div className={Style.transfer_box_history_item_info}>
                <p>
                  <span>Transfer ID:</span>
                  <span>#{el.id}</span>
                </p>
                <p>
                  <span>User Address:</span>
                  <span>{`${el.userAddress.slice(
                    0,
                    8
                  )}...${el.userAddress.slice(-6)}`}</span>
                </p>
                <p>
                  <span>Base Coin Amount:</span>
                  <span>
                    {el.baseCoinAmount} {el.baseCoin}
                  </span>
                </p>
                <p>
                  <span>Web Token Amount:</span>
                  <span>{el.webTokenAmount} WEB</span>
                </p>
                <span>
                  {new Date(el.createdAt).toLocaleString("vi-VN", {
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransferToken;
