import React from "react";
import Image from "next/image";
import { AiFillHeart, AiOutlineTeam } from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import Link from "next/link";

import Style from "./NFTCardTwo.module.css";

const NFTCardTwo = ({ NFTData }) => {
  return (
    <div className={Style.NFTCardTwo}>
      {NFTData?.filter((el) => el !== null).map((el, i) => (
        <Link href={{ pathname: "/NFT-details", query: el }} key={i}>
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
              ) : ["mp3", "wav", "ogg"].includes(el.fileExtension) ? (
                <div className={Style.audioContainer}>
                  <div className={Style.audioGlow}></div>

                  <div className={Style.audioDiscContainer}>
                    <div className={Style.audioDisc}>
                      <div className={Style.audioDiscCenter}></div>
                    </div>
                    <div className={Style.audioWavesCustom}>
                      {[...Array(12)].map((_, index) => (
                        <span key={index} className={Style.waveBar}></span>
                      ))}
                    </div>
                  </div>

                  <div className={Style.audioPlayerWrapper}>
                    <audio controls className={Style.customAudioTag}>
                      <source
                        src={el.pinataData}
                        type={`audio/${el.fileExtension}`}
                      />
                    </audio>
                  </div>
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
                <p className={Style.nft_name} title={el.name}>
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
                  <small>Giá hiện tại</small>
                  <p>{el.price} ZELL</p>
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

export default NFTCardTwo;
