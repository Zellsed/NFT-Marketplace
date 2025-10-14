import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsImages } from "react-icons/bs";
import Image from "next/image";
import { format } from "timeago.js";

import Style from "./NFTCard.module.css";
import images from "../../../img";
import Link from "next/link";
import { MdTimer } from "react-icons/md";

const NFTCard = ({ NFTData }) => {
  const [like, setLike] = useState(true);

  const likeNft = () => {
    if (!like) {
      setLike(true);
    } else {
      setLike(false);
    }
  };

  return (
    <div className={Style.NFTCard}>
      {NFTData?.map((el, i) => (
        <Link href={{ pathname: "/NFT-details", query: el }}>
          <div className={Style.NFTCard_box} key={i + 1}>
            <div className={Style.NFTCard_box_img}>
              {el.fileExtension === "mp4" || el.fileExtension === "webm" ? (
                <video
                  controls
                  autoPlay
                  muted
                  loop
                  className={Style.NFTCard_box_img_video}
                >
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
                  className={Style.NFTCard_box_img_img}
                  width={500}
                  height={500}
                  objectFit="cover"
                />
              )}
            </div>

            <div className={Style.NFTCard_box_update}>
              <div className={Style.NFTCard_box_update_left}>
                <div
                  className={Style.NFTCard_box_update_left_like}
                  onClick={() => likeNft()}
                >
                  {
                    <AiFillHeart
                      className={Style.NFTCard_box_update_left_like_icon}
                    />
                  }
                  {""} {el.likes}
                </div>
              </div>

              <div className={Style.NFTCard_box_update_right}>
                <div className={Style.NFTCard_box_update_right_info}>
                  <MdTimer />
                  <span>{format(Number(el.createdAt), "vi")}</span>
                </div>
              </div>
            </div>

            <div className={Style.NFTCard_box_update_details}>
              <div className={Style.NFTCard_box_update_details_price}>
                <div className={Style.NFTCard_box_update_details_price_box}>
                  <h4>
                    {el.name} #{el.tokenId}
                  </h4>

                  <div
                    className={Style.NFTCard_box_update_details_price_box_box}
                  >
                    <div
                      className={Style.NFTCard_box_update_details_price_box_bid}
                    >
                      <small>Current Bid</small>
                      <p>{el.price} ZELL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NFTCard;
