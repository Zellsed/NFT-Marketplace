import React from "react";
import Image from "next/image";
import { MdTimer } from "react-icons/md";

import Style from "./NFTBidProvance.module.css";
import images from "../../../img";
import Link from "next/link";

const NFTBidProvance = ({ dataTab }) => {
  return (
    <div className={Style.NFTBidProvance}>
      {dataTab
        .filter((el) => el !== null)
        .map((el, i) => (
          <Link
            href={{
              pathname: "/userNFT",
              query: `seller=${el.history.owner}`,
            }}
          >
            <div key={i} className={Style.NFTBidProvance_box}>
              <Image
                src={el.information.photo || images.avatar}
                alt="profile image"
                width={40}
                height={40}
                className={Style.NFTBidProvance_box_img}
              />

              <div className={Style.NFTBidProvance_box_info}>
                {el.history.historyType === "sell" && (
                  <div>
                    <h3 className={Style.NFTBidProvance_box_name}>
                      {el.user.name} - {el.history.seller}
                    </h3>
                    <div className={Style.NFTBidProvance_box_action}>
                      Create NFT price - <span>{el.history.price} ETH</span>
                    </div>
                  </div>
                )}

                {el.history.historyType === "buy" && (
                  <div>
                    <h3 className={Style.NFTBidProvance_box_name}>
                      {el.user.name} - {el.history.owner}
                    </h3>
                    <div className={Style.NFTBidProvance_box_action}>
                      Buy NFT price - <span>{el.history.price} ETH</span>
                    </div>
                  </div>
                )}

                {el.history.historyType === "resell" && (
                  <div>
                    <h3 className={Style.NFTBidProvance_box_name}>
                      {el.user.name} - {el.history.seller}
                    </h3>
                    <div className={Style.NFTBidProvance_box_action}>
                      Resell NFT price - <span>{el.history.price} ETH</span>
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
                  }).format(Number(el.history.createdAt))}
                </small>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default NFTBidProvance;
