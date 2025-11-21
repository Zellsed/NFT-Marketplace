import React from "react";
import Image from "next/image";
import { AiFillHeart, AiOutlineTeam } from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import Link from "next/link";

import Style from "./NFTCollectionCardTwo.module.css";
import { LikeProfile } from "../../components/componentsindex";

const NFTCollectionCardTwo = ({ NFTData }) => {
  return (
    <div className={Style.NFTCardTwo}>
      {NFTData?.filter((el) => el !== null).map((el, i) => (
        <Link href={{ pathname: "/NFTCollection-details", query: el }} key={i}>
          <div className={Style.NFTCardTwo_box}>
            <div className={Style.NFTCardTwo_box_header}>
              <span className={Style.NFTCardTwo_box_category}>
                {el.category}
              </span>
              <div className={Style.NFTCardTwo_box_likes}>
                <AiFillHeart className={Style.heart_icon} />
                <span>{el.likes}</span>
              </div>
            </div>

            <div className={Style.NFTCardTwo_box_media}>
              {el.fileExtension === "mp4" || el.fileExtension === "webm" ? (
                <div className={Style.media_container}>
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    className={Style.media_element}
                  >
                    <source
                      src={el.pinataData}
                      type={`video/${el.fileExtension}`}
                    />
                  </video>
                  <div className={Style.media_badge}>VIDEO</div>
                </div>
              ) : el.fileExtension === "mp3" ||
                el.fileExtension === "wav" ||
                el.fileExtension === "ogg" ? (
                <div className={Style.media_container}>
                  <div className={Style.audio_container}>
                    <audio controls className={Style.audio_element}>
                      <source
                        src={el.pinataData}
                        type={`audio/${el.fileExtension}`}
                      />
                    </audio>
                  </div>
                  <div className={Style.media_badge}>AUDIO</div>
                </div>
              ) : (
                <div className={Style.media_container}>
                  <Image
                    src={el.pinataData}
                    alt="NFT image"
                    width={250}
                    height={250}
                    className={Style.media_element}
                  />
                  <div className={Style.media_badge}>IMAGE</div>
                </div>
              )}
            </div>

            <div className={Style.NFTCardTwo_box_info}>
              <div className={Style.NFTCardTwo_box_info_left}>
                {/* <LikeProfile /> */}
                <p className={Style.nft_name}>
                  {el.name.length > 20 ? `${el.name.slice(0, 20)}...` : el.name}
                </p>
              </div>
              <div className={Style.NFTCardTwo_box_info_right}>
                <AiOutlineTeam className={Style.team_icon} />
                <span>{el.likes}</span>
              </div>
            </div>

            <div className={Style.NFTCardTwo_box_price}>
              <div className={Style.NFTCardTwo_box_price_content}>
                <div className={Style.NFTCardTwo_box_price_box}>
                  <small>Current Bid</small>
                  <p>{el.price} ZELL</p>
                  {el.amountAvailable && (
                    <div className={Style.amount_container}>
                      <span className={Style.amount_label}>Quantity:</span>
                      <span className={Style.amount_value}>
                        {el.amountAvailable}
                      </span>
                    </div>
                  )}
                </div>
                <div className={Style.NFTCardTwo_box_price_stock}>
                  <MdTimer />
                  <span>
                    {new Date(el.createdAt).toLocaleString("vi-VN", {
                      hour12: false,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTCollectionCardTwo;
