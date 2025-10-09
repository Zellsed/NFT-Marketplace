import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart, AiOutlineTeam } from "react-icons/ai";
import { MdVerified, MdTimer } from "react-icons/md";
import Link from "next/link";
import { format } from "timeago.js";

import Style from "./NFTCardTwo.module.css";
import { LikeProfile } from "../../components/componentsindex";

const NFTCardTwo = ({ NFTData }) => {
  return (
    <div className={Style.NFTCardTwo}>
      {NFTData?.filter((el) => el !== null).map((el, i) => (
        <Link href={{ pathname: "/NFT-details", query: el }} key={i}>
          <div className={Style.NFTCardTwo_box} key={i + 1}>
            <div className={Style.NFTCardTwo_box_like}>
              <div className={Style.NFTCardTwo_box_like_box}>
                <div className={Style.NFTCardTwo_box_like_box_box}>
                  <h3 className={Style.NFTCardTwo_box_like_box_box_icon}>
                    {el.category}
                  </h3>
                  <p>
                    <AiFillHeart />
                    {""}
                    <span>{el.likes}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className={Style.NFTCardTwo_box_img}>
              {el.fileExtension === "mp4" || el.fileExtension === "webm" ? (
                <video controls autoPlay muted loop>
                  <source
                    src={el.pinataData}
                    type={`video/${el.fileExtension}`}
                  />
                </video>
              ) : el.fileExtension === "mp3" ||
                el.fileExtension === "wav" ||
                el.fileExtension === "ogg" ? (
                <div className={Style.audioContainer}>
                  <audio
                    controls
                    className={Style.NFTCardTwo_box_NFT_audio_element}
                  >
                    <source
                      src={el.pinataData}
                      type={`audio/${el.fileExtension}`}
                    />
                  </audio>
                </div>
              ) : (
                <Image
                  src={el.pinataData}
                  alt="NFT image"
                  width={250}
                  height={250}
                  objectFit="cover"
                />
              )}
            </div>

            <div className={Style.NFTCardTwo_box_info}>
              <div className={Style.NFTCardTwo_box_info_left}>
                <LikeProfile />
                <p>
                  {el.name.slice(0, 15)}...{el.name.slice(-5)}
                </p>
              </div>

              <small>
                <AiOutlineTeam /> {el.likes}
              </small>
            </div>

            <div className={Style.NFTCardTwo_box_price}>
              <div className={Style.NFTCardTwo_box_price_box}>
                <small>Current Bid</small>
                <p>{el.price} ETH</p>
              </div>
              <p className={Style.NFTCardTwo_box_price_stock}>
                <MdTimer />

                <span>{format(Number(el.createdAt), "vi")}</span>
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTCardTwo;
