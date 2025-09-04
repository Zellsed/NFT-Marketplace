import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MdVerified,
  MdCloudUpload,
  MdOutlineReportProblem,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialYoutube,
  TiSocialInstagram,
  TiSocialTwitter,
} from "react-icons/ti";
import { AiFillCheckCircle, AiOutlineUserAdd } from "react-icons/ai";

import Style from "./AuthorProfileUserNft.module.css";
import images from "../../../img";
import { Button } from "../../components/componentsindex.js";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const AuthorProfileUserNft = ({ currentAccount, information, token, data }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountUser, setAccountUser] = useState("");
  const [accountFollowing, setAccountFollowing] = useState("");

  const follow = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const previousFollowStatus = isFollowing;

    try {
      const followUser = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/follow/follow-user`,
        {
          accountFollowing: currentAccount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsFollowing(followUser.data.liked);
    } catch (error) {
      console.error("Error fetching follow:", error);

      setIsFollowing(previousFollowStatus);
    }

    setIsLoading(false);
  };

  const copyAddress = () => {
    const copyText = document.getElementById("myInput");

    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  };

  useEffect(() => {
    if (!currentAccount) return;

    const fetchFollow = async () => {
      try {
        const statusResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/follow/follow-status?account=${currentAccount}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAccountUser(statusResponse.data.user.account);

        setAccountFollowing(statusResponse.data.following.account);

        setIsFollowing(statusResponse.data.exists);
      } catch (error) {
        console.error("Error fetching follow:", error);
      }
    };

    fetchFollow();
  }, [currentAccount]);

  return (
    <div className={Style.AuthorProfileUserNft}>
      <div className={Style.AuthorProfileUserNft_box}>
        <div className={Style.AuthorProfileUserNft_box_img}>
          <Image
            src={information?.photo ? information.photo : images.avatar}
            className={Style.AuthorProfileUserNft_box_img_img}
            alt="NFT IMAGES"
            width={220}
            height={220}
          />
        </div>

        <div className={Style.AuthorProfileUserNft_box_info}>
          <br />
          <br />
          <br />

          <h2>
            {data.name}
            {""}{" "}
            <span>
              <MdDriveFileRenameOutline />
            </span>{" "}
          </h2>

          <div className={Style.AuthorProfileUserNft_box_info_address}>
            <input type="text" value={currentAccount} id="myInput" />
            <FiCopy
              onClick={() => copyAddress()}
              className={Style.AuthorProfileUserNft_box_info_address_icon}
            />
          </div>

          <p className={Style.description}>{information.description}</p>

          <div className={Style.AuthorProfileUserNft_box_info_social}>
            <a href={information.facebook ? information.facebook : "#"}>
              <TiSocialFacebook />
            </a>
            <a href={information.twitter ? information.twitter : "#"}>
              <TiSocialTwitter />
            </a>
            <a href={information.instagram ? information.instagram : "#"}>
              <TiSocialInstagram />
            </a>
          </div>
        </div>

        <div className={Style.AuthorProfileUserNft_box_share}>
          {accountUser !== accountFollowing &&
            (isFollowing ? (
              <Button
                btnName="UnFollow"
                onClick={follow}
                icon={<AiFillCheckCircle style={{ marginRight: "8px" }} />}
              />
            ) : (
              <Button
                btnName="Follow"
                onClick={follow}
                icon={<AiOutlineUserAdd style={{ marginRight: "8px" }} />}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorProfileUserNft;
