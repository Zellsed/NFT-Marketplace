import React, { useState, useEffect } from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { TiTick } from "react-icons/ti";

import Style from "./FollowerTabCard.module.css";
import images from "../../../../img";
import { Button } from "../../../components/componentsindex.js";
import { AiFillCheckCircle, AiOutlineUserAdd } from "react-icons/ai";

import axios from "axios";
import dotenv from "dotenv";

import Link from "next/link";

dotenv.config();

const FollowerTabCard = ({ el, i }) => {
  const [user, setUser] = useState({});
  const [userDetail, setUserDetail] = useState({});
  const [token, setToken] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accountUser, setAccountUser] = useState("");
  const [accountFollowing, setAccountFollowing] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const follow = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const previousFollowStatus = isFollowing;

    try {
      const followUser = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/follow/follow-user`,
        {
          accountFollowing: el.seller,
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

  const fetchUserProfile = async () => {
    try {
      const userProfile = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/account-details?account=${el.seller}`
      );

      setUserDetail(userProfile.data.user);

      setUser(userProfile.data.userInformation);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchFollow = async () => {
      try {
        const statusResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/follow/follow-status?account=${el.seller}`,
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
    fetchUserProfile();
  }, [token]);

  return (
    <div className={Style.FollowerTabCard}>
      <div className={Style.FollowerTabCard_rank}>
        <p>
          #{i + 1} <span>🥇</span>
        </p>
      </div>

      <div className={Style.FollowerTabCard_box}>
        <div className={Style.FollowerTabCard_box_img}>
          <Image
            className={Style.FollowerTabCard_box_img_img}
            src={user?.background || images.background}
            alt="profile brafround"
            width={500}
            height={300}
            objectFit="cover"
          />
        </div>

        {/* <div className={Style.FollowerTabCard_box_profile}>
          <Image
            className={Style.FollowerTabCard_box_profile_img}
            alt="profile picture"
            width={50}
            height={50}
            src={user?.photo || images.avatar}
          />
          <Link
            href={{
              pathname: "/userNFT",
              query: `seller=${el.seller}`,
            }}
          />
        </div> */}

        <div className={Style.FollowerTabCard_box_profile}>
          <Link
            href={{
              pathname: "/userNFT",
              query: { seller: el.seller },
            }}
          >
            <Image
              className={Style.FollowerTabCard_box_profile_img}
              alt="profile picture"
              width={50}
              height={50}
              src={user?.photo || images.avatar}
            />
          </Link>
        </div>

        <div className={Style.FollowerTabCard_box_info}>
          <div className={Style.FollowerTabCard_box_info_name}>
            <h4>
              {el.seller?.slice(0, 10)}...
              {""}{" "}
            </h4>
            <p>
              {userDetail.name || ""} - {el.total || 0} ZELL
            </p>
          </div>

          <div className={Style.FollowerTabCard_box_info_following}>
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
    </div>
  );
};

export default FollowerTabCard;
