import React from "react";
import Image from "next/image";
import { MdTimer } from "react-icons/md";

import Style from "./NFTBidOwner.module.css";
import images from "../../../img";
import Link from "next/link";

const NFTBidOwner = ({ dataTab }) => {
  console.log("dataTab", dataTab);
  const { existNft, history, information, user } = dataTab;

  return (
    <div className={Style.NFTBidOwner}>
      {existNft && (
        <div className={Style.NFTBidOwner_owner}>
          <h2>Chủ sở hữu Nft</h2>

          <div className={Style.NFTBidOwner_owner_info}>
            <Link
              href={{
                pathname: "/userNFT",
                query: `seller=${user.account}}`,
              }}
            >
              <div className={Style.NFTBidOwner_owner_info_box}>
                <Image
                  src={information?.photo || images.avatar}
                  alt="profile image"
                  width={40}
                  height={40}
                  className={Style.NFTBidOwner_owner_info_box_img}
                />

                <div className={Style.NFTBidOwner_owner_info_box_info}>
                  <h3 className={Style.NFTBidOwner_owner_info_box_name}>
                    {user.name} - {user.account}
                  </h3>

                  <div className={Style.NFTBidOwner_owner_info_box_action}>
                    Giá NFT của chủ sở hữu - <span>{history.price} ZELL</span>
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
                    }).format(Number(history.createdAt))}
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
