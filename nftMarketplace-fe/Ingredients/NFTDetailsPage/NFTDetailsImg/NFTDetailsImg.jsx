import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import axios from "axios";
import dotenv from "dotenv";
import Style from "./NFTDetailsImg.module.css";

dotenv.config();

const NFTDetailsImg = ({ nft, token }) => {
  const [description, setDescription] = useState(true);
  const [details, setDetails] = useState(true);
  const [likeStatus, setLikeStatus] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const toggleDescription = () => setDescription((prev) => !prev);
  const toggleDetails = () => setDetails((prev) => !prev);

  const likeNFT = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const prevLiked = likeStatus;
    const prevCount = likeCount;

    setLikeStatus(!prevLiked);
    setLikeCount(prevLiked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/like-user`,
        { nftId: nft.tokenId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikeStatus(res.data.liked);
      setLikeCount(res.data.liked ? prevCount + 1 : prevCount - 1);
    } catch (error) {
      console.error("Error liking NFT:", error);
      setLikeStatus(prevLiked);
      setLikeCount(prevCount);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!nft?.tokenId) return;

    const fetchLikeData = async () => {
      try {
        const [countRes, statusRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/nft-likes?id=${nft.tokenId}`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/like-status?id=${nft.tokenId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setLikeCount(countRes.data.likeCount);
        setLikeStatus(statusRes.data.exists);
      } catch (error) {
        console.error("Error fetching like data:", error);
      }
    };

    fetchLikeData();
  }, [nft?.tokenId, token]);

  return (
    <div className={Style.NFTDetailsImg}>
      <div className={Style.NFTDetailsImg_box}>
        <div className={Style.NFTDetailsImg_header}>
          <h3 className={Style.NFTCategory}>{nft.category}</h3>

          <div
            className={`${Style.likeButton} ${likeStatus ? Style.liked : ""} ${
              isLoading ? Style.disabled : ""
            }`}
            onClick={likeNFT}
          >
            {likeStatus ? <AiFillHeart /> : <AiOutlineHeart />}
            <span>{likeCount}</span>
          </div>
        </div>

        <div className={Style.NFTDetailsImg_media}>
          {["mp4", "webm"].includes(nft.fileExtension) ? (
            <video controls autoPlay muted loop className={Style.NFTMedia}>
              <source
                src={nft.pinataData}
                type={`video/${nft.fileExtension}`}
              />
            </video>
          ) : ["mp3", "wav", "ogg"].includes(nft.fileExtension) ? (
            <audio controls className={Style.NFTAudio}>
              <source
                src={nft.pinataData}
                type={`audio/${nft.fileExtension}`}
              />
            </audio>
          ) : (
            <Image
              src={nft.pinataData}
              alt="NFT image"
              width={800}
              height={800}
              className={Style.NFTMedia}
            />
          )}
        </div>

        <div className={Style.NFTMetaInfo}>
          <h2 className={Style.NFTName}>
            {nft.name.length > 20 ? nft.name.slice(0, 20) + "..." : nft.name}
          </h2>
        </div>

        <div
          className={Style.NFTDetailsImg_section}
          onClick={toggleDescription}
        >
          <p>Description</p>
          {description ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>
        {description && (
          <div className={Style.NFTDetailsImg_content}>
            <p>{nft.description}</p>
          </div>
        )}

        <div className={Style.NFTDetailsImg_section} onClick={toggleDetails}>
          <p>Details</p>
          {details ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>
        {details && (
          <div className={Style.NFTDetailsImg_content}>
            <p>
              <small>File Size:</small> {nft.fileSize} MB
            </p>
            <p>
              <small>File Type:</small> {nft.fileExtension}
            </p>
            <p>
              <small>Owner:</small> {nft.owner}
            </p>
            <p>
              <small>Seller:</small> {nft.seller}
            </p>
            <p>
              <small>Token ID:</small> {nft.tokenId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTDetailsImg;
