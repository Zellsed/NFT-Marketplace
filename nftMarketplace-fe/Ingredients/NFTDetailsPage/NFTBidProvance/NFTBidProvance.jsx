import React from "react";
import Image from "next/image";
import { MdTimer } from "react-icons/md";

import Style from "./NFTBidProvance.module.css";
import images from "../../../img";
import Link from "next/link";

const NFTBidProvance = ({ dataTab }) => {
  return (
    <div className={Style.NFTBidProvance}>
      <Link
        href={{
          pathname: "/userNFT",
          query: `seller=${dataTab.history.owner}`,
        }}
      >
        <div className={Style.NFTBidProvance_box}>
          <Image
            src={dataTab.information.photo || images.avatar}
            alt="profile image"
            width={40}
            height={40}
            className={Style.NFTBidProvance_box_img}
          />

          <div className={Style.NFTBidProvance_box_info}>
            {dataTab.history.historyType === "sell" && (
              <div>
                <h3 className={Style.NFTBidProvance_box_name}>
                  {dataTab.user.name} - {dataTab.history.seller}
                </h3>
                <div className={Style.NFTBidProvance_box_action}>
                  NFT được tạo và đăng giá -{" "}
                  <span>{dataTab.history.price} ZELL</span>
                </div>
              </div>
            )}

            {dataTab.history.historyType === "buy" && (
              <div>
                <h3 className={Style.NFTBidProvance_box_name}>
                  {dataTab.user.name} - {dataTab.history.owner}
                </h3>
                <div className={Style.NFTBidProvance_box_action}>
                  Buy NFT price - <span>{dataTab.history.price} ZELL</span>
                </div>
              </div>
            )}

            {dataTab.history.historyType === "resell" && (
              <div>
                <h3 className={Style.NFTBidProvance_box_name}>
                  {dataTab.user.name} - {dataTab.history.seller}
                </h3>
                <div className={Style.NFTBidProvance_box_action}>
                  Resell NFT price - <span>{dataTab.history.price} ZELL</span>
                </div>
              </div>
            )}

            <small className={Style.NFTBidProvance_box_time}>
              <MdTimer className={Style.NFTBidProvance_box_icon} />
              {new Intl.DateTimeFormat("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }).format(Number(dataTab.history.createdAt))}
            </small>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default NFTBidProvance;
