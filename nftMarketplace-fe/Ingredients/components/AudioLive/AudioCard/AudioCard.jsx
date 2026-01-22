import React, { useState } from "react";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TbMusic } from "react-icons/tb";
import Style from "./AudioCard.module.css";
import Link from "next/link";

const AudioCard = ({ NFTData, Tab }) => {
  const [like, setLike] = useState(false);
  const likeNft = () => setLike(!like);

  const detailPath = Tab === "1155" ? "/NFTCollection-details" : "/NFT-details";

  return (
    <Link
      href={{
        pathname: detailPath,
        query: NFTData,
      }}
    >
      <div className={Style.audioCard}>
        <div className={Style.audioCard_box}>
          <div className={Style.audioCard_box_img}>
            <Image
              src={NFTData.pinataData || "/img/audio_bg.jpg"}
              alt="background"
              layout="fill"
              objectFit="cover"
              className={Style.audioCard_bg_blur}
            />
          </div>

          <div className={Style.audioCard_overlay}>
            <div className={Style.audioCard_box_like} onClick={likeNft}>
              {like ? <AiFillHeart /> : <AiOutlineHeart />}
              <span>{NFTData.likes}</span>
            </div>

            <div className={Style.audioCard_center}>
              <div className={Style.disc_wrapper}>
                <div className={Style.music_disc}>
                  <div className={Style.disc_inner}>
                    <TbMusic className={Style.music_icon} />
                  </div>
                </div>
                <div className={Style.visualizer_ring}>
                  {[...Array(12)].map((_, i) => (
                    <span key={i} className={Style.wave_bar}></span>
                  ))}
                </div>
              </div>

              <audio controls className={Style.custom_audio}>
                <source
                  src={NFTData.pinataData}
                  type={`audio/${NFTData.fileExtension}`}
                />
              </audio>
            </div>

            <div className={Style.audioCard_details}>
              <div className={Style.details_glass}>
                <div className={Style.info_left}>
                  <h4>{NFTData.name}</h4>
                  <small>#{NFTData.tokenId}</small>
                </div>
                <div className={Style.info_right}>
                  <div className={Style.price_tag}>
                    <span>Giá</span>
                    <p>{NFTData.price} ZELL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AudioCard;
