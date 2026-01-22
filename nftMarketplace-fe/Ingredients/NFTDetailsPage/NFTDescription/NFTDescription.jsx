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
  MdClose,
} from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { FaWallet, FaPercentage, FaLock } from "react-icons/fa";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from "react-icons/ti";
import { BiTransferAlt, BiDollar } from "react-icons/bi";

import Style from "./NFTDescription.module.css";
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

const NFTDescription = ({ nft, userInformation, user, token }) => {
  const [social, setSocial] = useState(false);
  const [NFTMenu, setNFTMenu] = useState(false);
  const [history, setHistory] = useState(true);
  const [provanance, setProvanance] = useState(false);
  const [owner, setOwner] = useState(false);
  const [usdPrice, setUsdPrice] = useState(null);
  const [isStaked, setIsStaked] = useState(false);

  const [bidHtr, setBidHtr] = useState([]);
  const [provance, setProvance] = useState([]);
  const [ownerNft, setOwnerNft] = useState([]);

  const [userAccount, setUserAccount] = useState("");

  const [showStakePopup, setShowStakePopup] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(0);
  const [isStaking, setIsStaking] = useState(false);

  const router = useRouter();

  const openNFTMenu = () => {
    if (!NFTMenu) {
      setNFTMenu(true);
      setSocial(false);
    } else {
      setNFTMenu(false);
    }
  };

  const openTabs = (e) => {
    const btnText = e.target.innerText;

    if (btnText == "Bid History") {
      setHistory(true);
      setProvanance(false);
      setOwner(false);
    } else if (btnText == "Provanance") {
      setHistory(false);
      setProvanance(true);
      setOwner(false);
    }
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

  const { buyNFT, currentAccount, checkIfNFTIsStaked, stakeNFT721 } =
    useContext(NFTMarketplaceContext);

  const bidHistory = async () => {
    try {
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-details/bid-history/${nft.tokenId}`,
      );

      setBidHtr(statusResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const provenanceNft = async () => {
    try {
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-details/provenance/${nft.tokenId}`,
      );

      setProvance(statusResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const accountOwnerNft = async () => {
    try {
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-details/owner/${nft.tokenId}`,
      );

      setOwnerNft(statusResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const checkStakingStatus = async () => {
    try {
      if (currentAccount && nft.tokenId) {
        const staked = await checkIfNFTIsStaked(nft.owner, nft.tokenId);
        setIsStaked(staked);
      }
    } catch (error) {
      console.error("Error checking staking status:", error);
    }
  };

  const handleStakeNFT = async () => {
    try {
      setIsStaking(true);
      await stakeNFT721(nft.tokenId, selectedDuration);
      setIsStaked(true);
      setShowStakePopup(false);
      alert("NFT staked successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error staking NFT:", error);
      alert("Failed to stake NFT");
    } finally {
      setIsStaking(false);
    }
  };

  const handleOpenStakePopup = () => {
    setShowStakePopup(true);
  };

  const handleCloseStakePopup = () => {
    setShowStakePopup(false);
    setSelectedDuration(0);
  };

  const handleViewStaking = () => {
    router.push("/staking");
  };

  const durationOptions = [
    { index: 0, days: 30, label: "30 Days" },
    { index: 1, days: 60, label: "60 Days" },
    { index: 2, days: 90, label: "90 Days" },
  ];

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

  useEffect(() => {
    if (currentAccount) {
      checkStakingStatus();
    }
  }, [currentAccount, nft.tokenId]);

  const renderOwnerButtons = () => {
    if (isStaked) {
      return (
        <div className={Style.button_group}>
          <Button
            icon=<FaLock />
            btnName="Đưa lên thị trường"
            onClick={null}
            classStyle={`${Style.button} ${Style.disabled_button}`}
            disabled={true}
          />

          <Button
            icon=<FaLock />
            btnName="NFT đã được đặt cược"
            onClick={handleViewStaking}
            classStyle={`${Style.button} ${Style.staked_button}`}
          />
        </div>
      );
    } else {
      return (
        <div className={Style.button_group}>
          <Button
            icon=<FaWallet />
            btnName="Niêm yết trên thị trường"
            onClick={() =>
              router.push(
                `/reSellToken?id=${nft.tokenId}&tokenURI=${nft.tokenURI}&token=${token}`,
              )
            }
            classStyle={Style.button}
          />
          <Button
            icon=<FaPercentage />
            btnName="Đặt cược NFT"
            onClick={handleOpenStakePopup}
            classStyle={`${Style.button} ${Style.stake_button}`}
          />
        </div>
      );
    }
  };

  const StakePopup = () => {
    if (!showStakePopup) return null;

    return (
      <div className={Style.popup_overlay}>
        <div className={Style.popup_content}>
          <div className={Style.popup_header}>
            <h2>Khóa NFT</h2>
            <button
              className={Style.popup_close}
              onClick={handleCloseStakePopup}
            >
              <MdClose />
            </button>
          </div>

          <div className={Style.popup_body}>
            <p>Chọn thời gian khóa cho NFT của bạn:</p>

            <div className={Style.duration_options}>
              {durationOptions.map((option) => (
                <div
                  key={option.index}
                  className={`${Style.duration_option} ${
                    selectedDuration === option.index
                      ? Style.duration_option_selected
                      : ""
                  }`}
                  onClick={() => setSelectedDuration(option.index)}
                >
                  <div className={Style.duration_radio}>
                    {selectedDuration === option.index && (
                      <div className={Style.duration_radio_selected} />
                    )}
                  </div>
                  <div className={Style.duration_info}>
                    <span className={Style.duration_label}>{option.label}</span>
                    <span className={Style.duration_days}>
                      {option.days} ngày
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={Style.stake_info}>
              <p>
                <strong>NFT:</strong> {nft.name} #{nft.tokenId}
              </p>
              <p>
                <strong>Thời gian đã chọn:</strong>{" "}
                {durationOptions[selectedDuration]?.label}
              </p>
            </div>
          </div>

          <div className={Style.popup_footer}>
            <Button
              btnName="Hủy bỏ"
              onClick={handleCloseStakePopup}
              classStyle={`${Style.button} ${Style.cancel_button}`}
            />
            <Button
              icon=<FaLock />
              btnName={isStaking ? "Đặt cược..." : "Xác nhận đặt cọc"}
              onClick={handleStakeNFT}
              disabled={isStaking}
              classStyle={`${Style.button} ${Style.confirm_button}`}
            />
          </div>
        </div>
      </div>
    );
  };

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
                <small>Giá đặt hiện tại</small>
                <p>{nft.price} ZELL </p>
              </div>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_button}>
              {currentAccount == nft.seller?.toLowerCase() ? (
                <p>Bạn không thể mua NFT của chính mình</p>
              ) : currentAccount == nft.owner?.toLowerCase() ? (
                renderOwnerButtons()
              ) : (
                <Button
                  icon=<FaWallet />
                  btnName="Mua NFT"
                  onClick={() => buyNFT(nft, token)}
                  classStyle={Style.button}
                />
              )}
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_tabs}>
              <button onClick={(e) => openTabs(e)}>Lịch sử đấu giá</button>
              <button onClick={(e) => openTabs(e)}>Nguồn gốc</button>
              <button onClick={() => openOwmer()}>Chủ sở hữu</button>
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

      <StakePopup />
    </div>
  );
};

export default NFTDescription;
