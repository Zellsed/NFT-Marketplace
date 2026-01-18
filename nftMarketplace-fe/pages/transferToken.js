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
        <h1>Mua token</h1>

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
            <h2>Bây giờ bạn có thể mua token</h2>
            <div className={Style.transfer_box_box_right_info}>
              <p className={Style.transfer_box_box_right_info_deskTop}>
                Tài khoản: {currentAccount}
              </p>
              <p className={Style.transfer_box_box_right_info_mobile}>
                Tài khoản: {currentAccount?.slice(0, 30)}...
              </p>
              <p>
                Số dư:{" "}
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
                  btnName="Mua Token WEB"
                  onClick={() => tranferToken(baseCoinNetwork, tranferAmount)}
                  classStyle={Style.button}
                />
              )}
            </div>
          </div>
        </div>

        <h1 className={Style.transfer_box_h1}>Lịch sử mua token trên web</h1>
        <p>
          Lịch sử mua token trên web cung cấp bản ghi chi tiết về tất cả các
          giao dịch token mà người dùng đã thực hiện trên nền tảng. Mỗi mục bao
          gồm các thông tin quan trọng như mã giao dịch, số lượng token, ngày
          mua, phương thức thanh toán và trạng thái giao dịch.
        </p>

        <p>
          Lịch sử này giúp người dùng dễ dàng theo dõi chi tiêu, xác minh các
          giao dịch đã hoàn tất và đảm bảo tính minh bạch trong việc quản lý tài
          sản số. Đồng thời, đây cũng là nguồn tham chiếu quan trọng cho việc
          kiểm toán và hỗ trợ khách hàng, giúp người dùng có toàn quyền kiểm
          soát và khả năng theo dõi đầy đủ các hoạt động liên quan đến token của
          mình.
        </p>

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
                  <span>Mã giao dịch chuyển:</span>
                  <span>#{el.id}</span>
                </p>
                <p>
                  <span>Địa chỉ người dùng:</span>
                  <span>{`${el.userAddress.slice(
                    0,
                    8
                  )}...${el.userAddress.slice(-6)}`}</span>
                </p>
                <p>
                  <span>Số lượng coin gốc:</span>
                  <span>
                    {el.baseCoinAmount} {el.baseCoin}
                  </span>
                </p>
                <p>
                  <span>Số lượng token web:</span>
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
