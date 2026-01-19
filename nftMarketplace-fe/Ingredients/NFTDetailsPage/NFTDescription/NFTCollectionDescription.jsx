import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  MdVerified,
  MdCloudUpload,
  MdTimer,
  MdReportProblem,
  MdOutlineDeleteSweep,
} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaWallet, FaPercentage } from "react-icons/fa";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";
import TokenAmount, {
  formatRawValue,
} from "../../components/formatTokenAmount/TokenAmount";
import Style from "./NFTCollectionDescription.module.css";
import images from "../../../img";
import { Button } from "../../components/componentsindex";
import {
  NFTBidHistory,
  NFTBidOwner,
  NFTBidProvance,
  NFTTabs,
} from "../NFTDetailsIndex";

import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";
import axios from "axios";

const NFTCollectionDescription = ({ nft, userInformation, user, token }) => {
  const [social, setSocial] = useState(false);
  const [NFTMenu, setNFTMenu] = useState(false);
  const [history, setHistory] = useState(true);
  const [provanance, setProvanance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [usdPrice, setUsdPrice] = useState(null);

  const [bidHtr, setBidHtr] = useState([]);
  const [provance, setProvance] = useState([]);
  const [ownerNft, setOwnerNft] = useState([]);

  const [userAccount, setUserAccount] = useState("");

  const [showQuantityInput, setShowQuantityInput] = useState(false);
  const [buyQuantity, setBuyQuantity] = useState(0);

  const router = useRouter();

  const openNFTMenu = () => {
    if (!NFTMenu) {
      setNFTMenu(true);
      setSocial(false);
    } else {
      setNFTMenu(false);
    }
  };

  const openTabs = (tab) => {
    setHistory(tab === "history");
    setProvanance(tab === "provenance");
    setOwner(tab === "owner");
  };

  const openOwmer = () => {
    if (!owner) {
      setOwner(true);
      setHistory(false);
      setProvanance(false);
    } else {
      setOwner(false);
      setHistory(true);
    }
  };

  const { buyNFT1155, currentAccount } = useContext(NFTMarketplaceContext);

  const bidHistory = async () => {
    try {
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-details/bid-history-nft1155/${nft.tokenId}`,
      );
      setBidHtr(statusResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const provenanceNft = async () => {
    try {
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-details/provenance-nft1155/${nft.tokenId}`,
      );
      setProvance(statusResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const accountOwnerNft = async () => {
    try {
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-details/owner-nft1155/${nft.tokenId}`,
      );

      setOwnerNft(statusResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
        );

        setUsdPrice(response.data.ethereum.usd);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEthPrice();
  }, []);

  useEffect(() => {
    if (nft.tokenId) {
      bidHistory();

      provenanceNft();

      accountOwnerNft();
    }
  }, [nft.tokenId]);

  useEffect(() => {
    if (nft.seller === "0x0000000000000000000000000000000000000000") {
      setUserAccount(nft.owner);
    } else {
      setUserAccount(nft.seller);
    }
  }, [nft]);

  return (
    <div className={Style.NFTDescription}>
      <div className={Style.NFTDescription_box}>
        <div className={Style.NFTDescription_box_share}>
          <p>{nft.category}</p>
        </div>
        <div className={Style.NFTDescription_box_profile}>
          <h1>
            {nft.name} - #{nft.tokenId}
          </h1>
          <div className={Style.NFTDescription_box_profile_box}>
            <div className={Style.NFTDescription_box_profile_box_left}>
              <Image
                src={userInformation.photo || images.avatar}
                alt="profile"
                width={40}
                height={40}
                className={Style.NFTDescription_box_profile_box_left_img}
              />
              <div className={Style.NFTDescription_box_profile_box_left_info}>
                <small>Người tạo</small> <br />
                <Link
                  href={{
                    pathname: "/userNFT",
                    query: `seller=${userAccount}`,
                  }}
                >
                  <span>
                    {user.name} <MdVerified />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          <div className={Style.NFTDescription_box_profile_biding}>
            <p>
              {userInformation.description
                ? userInformation.description
                : "NFT được tạo ra bằng công nghệ blockchain, cho phép xác thực quyền sở hữu và tính độc nhất của tài sản số. Mỗi NFT là một token không thể thay thế, có thể đại diện cho hình ảnh, video, nhạc hoặc bất kỳ nội dung số nào khác."}
            </p>
            <br />
            <p>
              <MdTimer /> <span>NFT được tạo từ: </span>
            </p>

            <div className={Style.NFTDescription_box_profile_biding_box_timer}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <br />
                <span>
                  {new Date(nft.createdAt).toLocaleString("vi-VN", {
                    hour12: false,
                  })}
                </span>
              </div>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_price}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_price_bid
                }
              >
                <small>Tổng giá</small>
                <p>{formatRawValue(nft.totalPrice)} ZELL </p>
              </div>
            </div>

            <div
              className={Style.NFTDescription_box_profile_biding_box_quantity}
            >
              <small className={Style.quantity_title}>Số lượng</small>
              <div className={Style.quantity_box}>
                <div className={Style.quantity_item}>
                  <small>Khả dụng</small>
                  <p>{nft.amountAvailable || 0}</p>
                </div>
                <div className={Style.quantity_divider}></div>
                <div className={Style.quantity_item}>
                  <small>Tổng cộng</small>
                  <p>{nft.amount || 0}</p>
                </div>
              </div>
            </div>

            <div
              className={
                Style.NFTDescription_box_profile_biding_box_pricePerItem
              }
            >
              <small>Giá mỗi NFT</small>
              <p>{nft.price} ZELL </p>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_button}>
              {currentAccount == nft.seller?.toLowerCase() ? (
                <p>Bạn không thể mua NFT của chính mình</p>
              ) : currentAccount == nft.owner?.toLowerCase() ? (
                <Button
                  icon=<FaWallet />
                  btnName="Đăng bán trên Marketplace"
                  onClick={() =>
                    router.push(
                      `/reSellToken?id=${nft.tokenId}&tokenURI=${nft.tokenURI}&token=${token}`,
                    )
                  }
                  classStyle={Style.button}
                />
              ) : (
                <>
                  <Button
                    icon=<FaWallet />
                    btnName="Mua NFT"
                    onClick={() => setShowQuantityInput(true)}
                    classStyle={Style.button}
                  />

                  {showQuantityInput && (
                    <div className={Style.modalOverlay}>
                      <div className={Style.modalContent}>
                        <h3>Mua NFT</h3>
                        <p>Khả dụng : {nft.amountAvailable || 0}</p>

                        <input
                          type="number"
                          min="1"
                          max={nft.amountAvailable || 1}
                          value={buyQuantity}
                          onChange={(e) =>
                            setBuyQuantity(Number(e.target.value))
                          }
                          className={Style.inputQuantity}
                          placeholder="Enter quantity"
                        />

                        <div className={Style.modalButtons}>
                          <Button
                            icon=<FaWallet />
                            btnName="Xác nhận mua"
                            onClick={() => {
                              if (
                                buyQuantity > 0 &&
                                buyQuantity <= (nft.amountAvailable || 1)
                              ) {
                                buyNFT1155(nft, buyQuantity, token);
                                setShowQuantityInput(false);
                              } else {
                                alert("Invalid quantity!");
                              }
                            }}
                            classStyle={Style.button}
                          />
                          <button
                            className={Style.cancelBtn}
                            onClick={() => setShowQuantityInput(false)}
                          >
                            Hủy bỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_tabs}>
              <button onClick={() => openTabs("history")}>
                Lịch sử đấu giá
              </button>
              <button onClick={() => openTabs("provenance")}>Nguồn gốc</button>
              <button onClick={() => openTabs("owner")}>Chủ sở hữu</button>
            </div>

            {history && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTBidHistory dataTab={bidHtr} />
              </div>
            )}
            {provanance && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTBidProvance dataTab={provance} />
              </div>
            )}

            {owner && (
              <div className={Style.NFTDescription_box_profile_biding_box_card}>
                <NFTBidOwner dataTab={ownerNft} icon=<MdVerified /> />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCollectionDescription;
