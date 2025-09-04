import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { FaEthereum, FaUserAlt } from "react-icons/fa";

import Style from "../styles/transferFunds.module.css";
import fromStyle from "../Ingredients/AccountPage/Form/Form.module.css";
import images from "../img";
import { Button, Loader } from "../Ingredients/components/componentsindex";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

import StyleFrom from "../Ingredients/AccountPage/Form/Form.module.css";

const transferFunds = () => {
  const {
    currentAccount,
    transferEther,
    loading,
    accountBalance,
    transactions,
    getAllTransactions,
  } = useContext(NFTMarketplaceContext);
  const [tranferAmount, setTranferAmount] = useState("");
  const [tranferAccount, setTranferAccount] = useState("");
  const [message, setMessage] = useState("");
  const [readMessage, setReadMessage] = useState("");
  const [openBox, setOpenBox] = useState(false);

  useEffect(() => {
    getAllTransactions();
  }, []);

  return (
    <div className={Style.transfer}>
      <div className={Style.transfer_box}>
        <h1>Transfer Ether</h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere
          perferendis, praesentium obcaecati nostrum architecto nisi! Eum
          numquam error, illo eaque.{" "}
        </p>
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
            <h2>Now you can transfer ether</h2>
            <div className={Style.transfer_box_box_right_info}>
              <p className={Style.transfer_box_box_right_info_deskTop}>
                Account: {currentAccount}
              </p>
              <p className={Style.transfer_box_box_right_info_mobile}>
                Account: {currentAccount.slice(1, 30)}...
              </p>
              <p>
                Balance:{" "}
                <span style={{ whiteSpace: "nowrap" }}>
                  {accountBalance.slice(0, 15)}... ETH
                </span>
              </p>
            </div>

            <div className={Style.transfer_box_box_right_box}>
              <div className={StyleFrom.Form_box_input}>
                <div className={StyleFrom.Form_box_input_box}>
                  <div className={StyleFrom.Form_box_input_box_icon}>
                    <FaUserAlt />
                  </div>
                  <input
                    type="text"
                    placeholder="address*"
                    onChange={(e) => setTranferAccount(e.target.value)}
                  />
                </div>
              </div>

              <div className={StyleFrom.Form_box_input}>
                <div className={StyleFrom.Form_box_input_box}>
                  <div className={StyleFrom.Form_box_input_box_icon}>
                    <FaEthereum />
                  </div>
                  <input
                    type="number"
                    min={1}
                    placeholder="ETH"
                    onChange={(e) => setTranferAmount(e.target.value)}
                  />
                </div>
              </div>
              <div className={StyleFrom.Form_box_input}>
                <label htmlFor="description">Description</label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="6"
                  placeholder="your message in few words"
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {loading ? (
                <Loader />
              ) : (
                <Button
                  btnName="Transfer Funds"
                  onClicks={() =>
                    transferEther(tranferAccount, tranferAmount, message)
                  }
                  classStyle={Style.button}
                />
              )}
            </div>
          </div>
        </div>

        <h1 className={Style.transfer_box_h1}>Transaction History</h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere
          perferendis, praesentium obcaecati nostrum architecto nisi! Eum
          numquam error, illo eaque.
        </p>

        <div className={Style.transfer_box_history}>
          {transactions.map((el, i) => (
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
                  <span>Transfer ID:</span> #{i + 1}
                </p>
                <p>
                  <span>Amount:</span> {el.amount} ETH
                </p>
                <p>
                  <span>From:</span>{" "}
                  {`${el.addressFrom.slice(0, 16)}...${el.addressFrom.slice(
                    -5
                  )}`}
                </p>
                <p>
                  <span>To:</span>{" "}
                  {`${el.addressTo.slice(0, 16)}...${el.addressTo.slice(-5)}`}
                </p>

                <Button
                  btnName="Message"
                  onClicks={() => (
                    setReadMessage(el.message), setOpenBox(true)
                  )}
                  classStyle={Style.readButton}
                />
              </div>
            </div>
          ))}
        </div>

        {openBox == false ? (
          ""
        ) : (
          <div className={Style.messageBox} onClick={() => setOpenBox(false)}>
            <div className={Style.messageBox_box}>
              <h1>Transaction Message</h1>
              <p>{readMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default transferFunds;
