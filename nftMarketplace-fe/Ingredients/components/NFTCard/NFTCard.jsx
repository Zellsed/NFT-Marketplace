import React, { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsImages } from "react-icons/bs";
import Image from "next/image";
import { format } from "timeago.js";

import Style from "./NFTCard.module.css";
import images from "../../../img";
import Link from "next/link";
import { MdTimer } from "react-icons/md";

const ITEMS_PER_PAGE = 8;

const NFTCard = ({ NFTData }) => {
  const [like, setLike] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const likeNft = () => setLike(!like);

  const totalItems = NFTData?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = NFTData?.slice(startIndex, endIndex) || [];

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (totalItems === 0) {
    return (
      <div className={Style.NFTCardContainer}>
        <div className={Style.empty}>
          <div className={Style.empty_box}>
            <span className={Style.empty_icon}>📦</span>
            <h3>Chưa có dữ liệu</h3>
            <p>
              Hiện tại chưa có NFT nào để hiển thị.
              <br />
              Vui lòng thử lại sau hoặc chọn danh mục khác.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                ) : ["mp3", "wav", "ogg"].includes(el.fileExtension) ? (
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
                    onClick={(e) => {
                      e.preventDefault();
                      likeNft();
                    }}
                  >
                    <AiFillHeart
                      className={Style.NFTCard_box_update_left_like_icon}
                    />
                    {el.likes}
                  </div>
                </div>

                <div className={Style.NFTCard_box_update_right}>
                  <div className={Style.NFTCard_box_update_right_info}>
                    <MdTimer />{" "}
                    <span>
                      {new Date(el.createdAt).toLocaleString("vi-VN", {
                        hour12: false,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className={Style.NFTCard_box_update_details}>
                <div className={Style.NFTCard_box_update_details_price}>
                  <div className={Style.NFTCard_box_update_details_price_box}>
                    <h4 className={Style.nftTitle}>
                      {el.name.slice(0, 20)} #{el.tokenId}
                    </h4>

                    <div
                      className={Style.NFTCard_box_update_details_price_box_box}
                    >
                      <div
                        className={
                          Style.NFTCard_box_update_details_price_box_bid
                        }
                      >
                        <small>Giá hiện tại</small>
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

      {totalPages > 1 && (
        <div className={Style.pagination}>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={Style.pageBtn}
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`${Style.pageBtn} ${
                currentPage === page ? Style.active : ""
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={Style.pageBtn}
          >
            Tiếp
          </button>
        </div>
      )}
    </div>
  );
};

export default NFTCard;
