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

const NFTReSellCollectionDescription = ({
  nft,
  userInformation,
  user,
  token,
}) => {
  console.log("nft", nft);
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

  const { buyNFT1155, currentAccount } = useContext(NFTMarketplaceContext);

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
                <small>Current Bid</small>
                <p>{formatRawValue(nft.totalPrice)} ZELL </p>
              </div>
            </div>

            <div
              className={Style.NFTDescription_box_profile_biding_box_quantity}
            >
              <small className={Style.quantity_title}>Quantity</small>
              <div className={Style.quantity_box}>
                <div className={Style.quantity_item}>
                  <small>Available</small>
                  <p>{nft.amountAvailable || 0}</p>
                </div>
                <div className={Style.quantity_divider}></div>
                <div className={Style.quantity_item}>
                  <small>Total</small>
                  <p>{nft.amount || 0}</p>
                </div>
              </div>
            </div>

            <div
              className={
                Style.NFTDescription_box_profile_biding_box_pricePerItem
              }
            >
              <small>Price per NFT</small>
              <p>{nft.price || 0} ZELL </p>
            </div>

            <div className={Style.NFTDescription_box_profile_biding_box_button}>
              {currentAccount == nft.seller?.toLowerCase() ? (
                <p>You cannot buy your own NFT</p>
              ) : currentAccount == nft.owner?.toLowerCase() ? (
                <Button
                  icon=<FaWallet />
                  btnName="List on Marketplace"
                  onClick={() =>
                    router.push(
                      `/reSellToken1155?id=${nft.tokenId}&tokenURI=${nft.tokenURI}&tokenQuantity=${nft.amount}&nftData=${nft}&token=${token}`
                    )
                  }
                  classStyle={Style.button}
                />
              ) : (
                <>
                  <Button
                    icon=<FaWallet />
                    btnName="Buy NFT"
                    onClick={() => setShowQuantityInput(true)}
                    classStyle={Style.button}
                  />

                  {showQuantityInput && (
                    <div className={Style.modalOverlay}>
                      <div className={Style.modalContent}>
                        <h3>Buy NFT</h3>
                        <p>Available: {nft.amountAvailable || 0}</p>

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
                            btnName="Confirm Buy"
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
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
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

export default NFTReSellCollectionDescription;
