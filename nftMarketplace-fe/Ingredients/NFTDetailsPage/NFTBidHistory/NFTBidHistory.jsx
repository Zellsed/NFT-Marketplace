import React from "react";
import Image from "next/image";
import { MdTimer } from "react-icons/md";

import Style from "./NFTBidHistory.module.css";
import images from "../../../img";
import Link from "next/link";

const NFTBidHistory = ({ dataTab }) => {
  return (
    <div className={Style.NFTBidHistory}>
      {dataTab
        .filter((el) => el !== null)
        .map((el, i) => (
          <Link
            href={{
              pathname: "/userNFT",
              query: `seller=${el.history.seller}`,
            }}
          >
            <div key={i} className={Style.NFTBidHistory_box}>
              <Image
                src={el.information.photo || images.avatar}
                alt="profile image"
                width={40}
                height={40}
                className={Style.NFTBidHistory_box_img}
              />

              <div className={Style.NFTBidHistory_box_info}>
                <h3 className={Style.NFTBidHistory_box_name}>
                  {el.user.name} - {el.history.seller}
                </h3>

                {el.history.historyType === "sell" && (
                  <div className={Style.NFTBidHistory_box_action}>
                    Create and sell at - <span>{el.history.price} ETH</span>
                  </div>
                )}

                {el.history.historyType === "resell" && (
                  <div className={Style.NFTBidHistory_box_action}>
                    Buy and resell at - <span>{el.history.price} ETH</span>
                  </div>
                )}

                <small className={Style.NFTBidHistory_box_time}>
                  <MdTimer className={Style.NFTBidHistory_box_icon} />
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

export default NFTBidHistory;
