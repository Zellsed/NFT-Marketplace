import React, { useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import { MdTimer } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import Style from "./NFTCard.module.css";

const ITEMS_PER_PAGE = 8;

const NFTCard = ({ NFTData }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = NFTData?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentItems =
    NFTData?.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    ) || [];

  if (totalItems === 0)
    return (
      <div className={Style.empty_box}>
        <span className={Style.empty_icon}>📦</span>
        <h3>Chưa có dữ liệu cho mục này</h3>
      </div>
    );

  return (
    <div className={Style.NFTCardContainer}>
      <div className={Style.NFTCard}>
        {currentItems.map((el, i) => (
          <Link
            key={i}
            href={{ pathname: "/NFT-details", query: el }}
            className={Style.NFTCard_box_wrapper}
          >
            <div className={Style.NFTCard_box}>
              <div className={Style.NFTCard_box_img}>
                {el.fileExtension === "mp4" ? (
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    className={Style.NFTCard_box_img_img}
                  >
                    <source src={el.pinataData} type="video/mp4" />
                  </video>
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
                  <Image
                    src={el.pinataData}
                    alt="NFT"
                    className={Style.NFTCard_box_img_img}
                    width={500}
                    height={500}
                    objectFit="cover"
                  />
                )}
              </div>

              <div className={Style.NFTCard_box_update}>
                <div className={Style.NFTCard_box_update_left}>
                  <div className={Style.likeBtn}>
                    <AiFillHeart /> {el.likes || 0}
                  </div>
                </div>
                <div className={Style.NFTCard_box_update_right}>
                  <div className={Style.timerBox}>
                    <MdTimer />{" "}
                    <span>{new Date(el.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className={Style.NFTCard_box_details}>
                <div className={Style.details_price_skew}>
                  <div className={Style.details_content}>
                    <h4 className={Style.nftTitle}>
                      {el.name} #{el.tokenId}
                    </h4>
                    <div className={Style.price_box}>
                      <small>Giá hiện tại</small>
                      <p>{el.price} ZELL</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={Style.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`${Style.pageBtn} ${
                currentPage === i + 1 ? Style.active : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTCard;
