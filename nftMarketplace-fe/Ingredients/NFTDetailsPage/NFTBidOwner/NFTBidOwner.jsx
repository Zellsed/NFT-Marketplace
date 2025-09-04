import React from "react";
import Image from "next/image";
import { MdTimer } from "react-icons/md";

import Style from "./NFTBidOwner.module.css";
import images from "../../../img";
import Link from "next/link";

const NFTBidOwner = ({ dataTab }) => {
  return (
    <div className={Style.NFTBidOwner}>
      {dataTab.ownerNft && (
        <div className={Style.NFTBidOwner_owner}>
          <h2>Owner Nft</h2>

          <div className={Style.NFTBidOwner_owner_info}>
            <Link
              href={{
                pathname: "/userNFT",
                query: `seller=${dataTab.ownerNft.user.account}`,
              }}
            >
              <div className={Style.NFTBidOwner_owner_info_box}>
                <Image
                  src={dataTab.ownerNft.information.photo || images.avatar}
                  alt="profile image"
                  width={40}
                  height={40}
                  className={Style.NFTBidOwner_owner_info_box_img}
                />

                <div className={Style.NFTBidOwner_owner_info_box_info}>
                  <h3 className={Style.NFTBidOwner_owner_info_box_name}>
                    {dataTab.ownerNft.user.name} -{" "}
                    {dataTab.ownerNft.user.account}
                  </h3>

                  <div className={Style.NFTBidOwner_owner_info_box_action}>
                    Owner NFT price -{" "}
                    <span>{dataTab.ownerNft.history.price} ETH</span>
                  </div>

                  <small className={Style.NFTBidOwner_owner_info_box_time}>
                    <MdTimer className={Style.NFTBidOwner_box_icon} />
                    {new Intl.DateTimeFormat("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(Number(dataTab.ownerNft.history.createdAt))}
                  </small>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      {dataTab.ownerNft && dataTab.createNft && (
        <hr className={Style.separator} />
      )}

      {dataTab.createNft && (
        <div className={Style.NFTBidOwner_owner}>
          <h2>Create Nft</h2>

          <div className={Style.NFTBidOwner_owner_info}>
            <Link
              href={{
                pathname: "/userNFT",
                query: `seller=${dataTab.createNft.user.account}`,
              }}
            >
              <div className={Style.NFTBidOwner_owner_info_box}>
                <Image
                  src={dataTab.createNft.information.photo || images.avatar}
                  alt="profile image"
                  width={40}
                  height={40}
                  className={Style.NFTBidOwner_owner_info_box_img}
                />

                <div className={Style.NFTBidOwner_owner_info_box_info}>
                  <h3 className={Style.NFTBidOwner_owner_info_box_name}>
                    {dataTab.createNft.user.name} -{" "}
                    {dataTab.createNft.user.account}
                  </h3>

                  <div className={Style.NFTBidOwner_owner_info_box_action}>
                    Create NFT price -{" "}
                    <span>{dataTab.createNft.history.price} ETH</span>
                  </div>

                  <small className={Style.NFTBidOwner_owner_info_box_time}>
                    <MdTimer className={Style.NFTBidOwner_box_icon} />
                    {new Intl.DateTimeFormat("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }).format(Number(dataTab.createNft.history.createdAt))}
                  </small>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTBidOwner;
