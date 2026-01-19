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
        { headers: { Authorization: `Bearer ${token}` } },
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/account-details?account=${el.seller}`,
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
          { headers: { Authorization: `Bearer ${token}` } },
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
      <div className={Style.rank}>
        <span>#{i + 1}</span>
        <span className={Style.trophy}>🏆</span>
      </div>

      <div className={Style.card}>
        <div className={Style.bgWrapper}>
          <Image
            src={user?.background || images.background}
            alt="background"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            className={Style.bg}
          />
          <div className={Style.overlay} />
        </div>

        <div className={Style.avatarContainer}>
          <Link href={{ pathname: "/userNFT", query: { seller: el.seller } }}>
            <Image
              src={user?.photo || images.avatar}
              alt="avatar"
              width={90}
              height={90}
              className={Style.avatar}
            />
          </Link>
        </div>

        <div className={Style.info}>
          <h4 className={Style.name}>
            {el.seller?.slice(0, 6)}...{el.seller?.slice(-4)}
            {userDetail?.verified && <MdVerified className={Style.verified} />}
          </h4>
          <p className={Style.stats}>
            {userDetail.name || "Unknown"} • {el.total || 0} ZELL
          </p>

          {accountUser !== accountFollowing &&
            (isFollowing ? (
              <button
                className={`${Style.followBtn} ${Style.following}`}
                onClick={follow}
                disabled={isLoading}
              >
                <AiFillCheckCircle /> Đang theo dõi
              </button>
            ) : (
              <button
                className={Style.followBtn}
                onClick={follow}
                disabled={isLoading}
              >
                <AiOutlineUserAdd /> Theo dõi
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FollowerTabCard;
