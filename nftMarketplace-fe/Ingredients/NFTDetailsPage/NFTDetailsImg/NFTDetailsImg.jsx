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

  const openDescription = () => setDescription((prev) => !prev);
  const openDetails = () => setDetails((prev) => !prev);

  const likeNFT = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const previousLikeStatus = likeStatus;
    const previousLikeCount = likeCount;

    setLikeStatus(!previousLikeStatus);
    setLikeCount(previousLikeStatus ? likeCount - 1 : likeCount + 1);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/like-user`,
        { nftId: nft.tokenId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLikeStatus(response.data.liked);
      setLikeCount(
        response.data.liked ? previousLikeCount + 1 : previousLikeCount - 1
      );
    } catch (error) {
      console.error("Error liking NFT:", error);

      setLikeStatus(previousLikeStatus);
      setLikeCount(previousLikeCount);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!nft?.tokenId) return;

    const fetchNftData = async () => {
      try {
        const likeResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/nft-likes?id=${nft.tokenId}`
        );

        setLikeCount(likeResponse.data.likeCount);

        const statusResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/like-status?id=${nft.tokenId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLikeStatus(statusResponse.data.exists);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
      }
    };

    fetchNftData();
  }, [nft?.tokenId]);

  return (
    <div className={Style.NFTDetailsImg}>
      <div className={Style.NFTDetailsImg_box}>
        <div className={Style.NFTDetailsImg_box_NFT}>
          <div className={Style.NFTDetailsImg_box_NFT_like}>
            <h3>{nft.category}</h3>

            <p
              onClick={likeNFT}
              style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {likeStatus ? (
                <AiFillHeart
                  className={Style.NFTDetailsImg_box_NFT_like_icon}
                />
              ) : (
                <AiOutlineHeart
                  className={Style.NFTDetailsImg_box_NFT_like_icon}
                />
              )}
              <span>{likeCount}</span>
            </p>
          </div>

          <div className={Style.NFTDetailsImg_box_NFT_img}>
            {["mp4", "webm"].includes(nft.fileExtension) ? (
              <video
                controls
                autoPlay
                muted
                loop
                className={Style.NFTDetailsImg_box_NFT_img_img}
              >
                <source
                  src={nft.pinataData}
                  type={`video/${nft.fileExtension}`}
                />
              </video>
            ) : ["mp3", "wav", "ogg"].includes(nft.fileExtension) ? (
              <audio
                controls
                className={Style.NFTCardTwo_box_NFT_audio_element}
              >
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
                objectFit="cover"
                className={Style.NFTDetailsImg_box_NFT_img_img}
              />
            )}
          </div>
        </div>

        <div
          className={Style.NFTDetailsImg_box_description}
          onClick={openDescription}
        >
          <p>Description</p>
          {description ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>
        {description && (
          <div className={Style.NFTDetailsImg_box_description_box}>
            <p>{nft.description}</p>
          </div>
        )}

        <div className={Style.NFTDetailsImg_box_details} onClick={openDetails}>
          <p>Details</p>
          {details ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
        </div>
        {details && (
          <div className={Style.NFTDetailsImg_box_details_box}>
            <p>
              <small>File Size:</small> {nft.fileSize} MB
            </p>
            <p>
              <small>File Extension:</small> {nft.fileExtension}
            </p>
            <p>
              <small>NFT Owner:</small> {nft.owner}
            </p>
            <p>
              <small>NFT Seller:</small> {nft.seller}
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
