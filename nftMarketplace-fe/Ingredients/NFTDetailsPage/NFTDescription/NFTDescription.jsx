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

  const [bidHtr, setBidHtr] = useState([]);
  const [provance, setProvance] = useState([]);
  const [ownerNft, setOwnerNft] = useState([]);

  const [userAccount, setUserAccount] = useState("");

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

  const { buyNFT, currentAccount } = useContext(NFTMarketplaceContext);

  const bidHistory = async () => {
    try {
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-details/bid-history?id=${nft.tokenId}`
      );

      setBidHtr(statusResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const provenanceNft = async () => {
    try {
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-details/provenance?id=${nft.tokenId}`
      );

      setProvance(statusResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  const accountOwnerNft = async () => {
    try {
      const statusResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-details/owner?id=${nft.tokenId}`
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
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
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
          <div className={Style.NFTDescription_box_share_box}>
            <BsThreeDots
              className={Style.NFTDescription_box_share_box_icon}
              onClick={() => openNFTMenu()}
            />

            {NFTMenu && (
              <div className={Style.NFTDescription_box_share_box_social}>
                <a href="#">
                  <MdOutlineDeleteSweep /> Delete item
                </a>
              </div>
            )}
          </div>
        </div>
        <div className={Style.NFTDescription_box_profile}>
          <h1>
            {nft.name} #{nft.tokenId}
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
                <small>Creator</small> <br />
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
                : "NFTs are created using blockchain technology, enabling the verification of ownership and the uniqueness of digital assets. Each NFT is a non-fungible token that can represent images, videos, music, or any other digital content."}
            </p>
            <br />
            <p>
              <MdTimer /> <span>NFT is created from: </span>
            </p>

            <div className={Style.NFTDescription_box_profile_biding_box_timer}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_timer_item
                }
              >
                <br />
                <span>
                  {new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(Number(nft.createdAt))}
                </span>
              </div>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_price}>
              <div
                className={
                  Style.NFTDescription_box_profile_biding_box_price_bid
                }
              >
                <small>Current Bid</small>
                <p>
                  {nft.price} ZELL{" "}
                  {/* <span>( ≈ ${Number(nft.price * usdPrice).toFixed(2)})</span> */}
                </p>
              </div>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_button}>
              {currentAccount == nft.seller?.toLowerCase() ? (
                <p>You cannoy buy your own NFT</p>
              ) : currentAccount == nft.owner?.toLowerCase() ? (
                <Button
                  icon=<FaWallet />
                  btnName="List on Marketplace"
                  onClick={() =>
                    router.push(
                      `/reSellToken?id=${nft.tokenId}&tokenURI=${nft.tokenURI}&token=${token}`
                    )
                  }
                  classStyle={Style.button}
                />
              ) : (
                <Button
                  icon=<FaWallet />
                  btnName="Buy NFT"
                  onClick={() => buyNFT(nft, token)}
                  classStyle={Style.button}
                />
              )}
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_tabs}>
              <button onClick={(e) => openTabs(e)}>Bid History</button>
              <button onClick={(e) => openTabs(e)}>Provanance</button>
              <button onClick={() => openOwmer()}>Owner</button>
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

export default NFTDescription;
