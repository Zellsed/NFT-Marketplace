import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import {
  FaEthereum,
  FaUserAlt,
  FaBitcoin,
  FaViacoin,
  FaCoins,
} from "react-icons/fa";

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
    baseCoinNetwork,
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
        <h1>Chuyển token - {baseCoinNetwork}</h1>
        <p>
          Chuyển token cho phép bạn gửi token từ ví của mình sang ví khác một
          cách nhanh chóng và an toàn. Bạn có thể theo dõi trạng thái giao dịch,
          đảm bảo số lượng token chính xác và quản lý lịch sử chuyển token mọi
          lúc, mọi nơi.{" "}
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
            <h2>Bây giờ bạn có thể chuyển token {baseCoinNetwork}</h2>
            <div className={Style.transfer_box_box_right_info}>
              <p className={Style.transfer_box_box_right_info_deskTop}>
                Tài khoản: {currentAccount}
              </p>
              <p className={Style.transfer_box_box_right_info_mobile}>
                Tài khoản: {currentAccount.slice(1, 30)}...
              </p>
              <p>
                Số dư:{" "}
                <span style={{ whiteSpace: "nowrap" }}>
                  {accountBalance.slice(0, 15)}... {baseCoinNetwork}
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
                    placeholder="Địa chỉ *"
                    onChange={(e) => setTranferAccount(e.target.value)}
                  />
                </div>
              </div>

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
              <div className={StyleFrom.Form_box_input}>
                <label htmlFor="description">Mô tả</label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="6"
                  placeholder="Nhập mô tả"
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              {loading ? (
                <Loader />
              ) : (
                <Button
                  btnName="Chuyển tiền"
                  onClick={() =>
                    transferEther(tranferAccount, tranferAmount, message)
                  }
                  classStyle={Style.button}
                />
              )}
            </div>
          </div>
        </div>

        <h1 className={Style.transfer_box_h1}>Lịch sử giao dịch</h1>
        <p>
          Lịch sử giao dịch cho phép bạn theo dõi toàn bộ các giao dịch đã thực
          hiện trên hệ thống. Bạn có thể xem chi tiết mỗi giao dịch, bao gồm
          ngày, giờ, số tiền, loại giao dịch và trạng thái, giúp quản lý tài
          chính minh bạch và dễ dàng hơn.
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
                  onClick={() => (setReadMessage(el.message), setOpenBox(true))}
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
