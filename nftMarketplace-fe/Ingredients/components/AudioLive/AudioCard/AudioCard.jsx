import React, { useState } from "react";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Style from "./AudioCard.module.css";
import images from "../../../../img";
import LikeProfile from "../../LikeProfile/LikeProfile";

const AudioCard = ({ NFTData }) => {
  const [like, setLike] = useState(false);

  const likeNft = () => {
    setLike(!like);
  };

  return (
    <div className={Style.audioCard}>
      <div className={Style.audioCard_box}>
        <div className={Style.audioCard_box_like_time}>
          <div className={Style.audioCard_box_like} onClick={likeNft}>
            {like ? (
              <AiFillHeart className={Style.audioCard_box_like_icon} />
            ) : (
              <AiOutlineHeart
                className={Style.audioCard_box_like_icon_unlike}
              />
            )}
            <span>24</span>
          </div>
          <div className={Style.audioCard_box_time}>
            <div className={Style.audioCard_box_like_time_remaing}>
              <small>Remaining time</small>
              <h5>3h : 15m : 20s</h5>
            </div>
          </div>
        </div>

        <div className={Style.audioCard_box_player}>
          <Image src={images.musiceWave} alt="music" width={200} />
          <audio controls>
            <source
              src={NFTData.pinataData}
              type={`audio/${NFTData.fileExtension}`}
            />
          </audio>
        </div>

        <div className={Style.audioCard_box_details}>
          <div className={Style.audioCard_box_details_info}>
            <h4>
              {NFTData.name} &nbsp;&nbsp; #{NFTData.tokenId}
            </h4>
            <div className={Style.audioCard_box_details_info_price}>
              <small>Price</small>
              <p>{NFTData.price} ETH</p>
            </div>
          </div>

          <div className={Style.audioCard_box_details_stock}>
            <LikeProfile />
            <small>24 in stock</small>
          </div>
        </div>

        <div className={Style.audioCard_box_img}>
          <Image
            src={images.creatorbackground10}
            alt="background"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioCard;
