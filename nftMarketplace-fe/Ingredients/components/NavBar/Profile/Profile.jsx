import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaUserAlt, FaRegImage, FaUserEdit, FaCoins } from "react-icons/fa";
import { MdHelpCenter } from "react-icons/md";
import {
  TbDownloadOff,
  TbDownload,
  TbLogout,
  TbLogin,
  TbRegistered,
} from "react-icons/tb";
import Link from "next/link";

import Style from "./Profile.module.css";
import images from "../../../../img";

import axios from "axios";
import dotenv from "dotenv";
import { useRouter } from "next/router";

dotenv.config();

const Profile = ({}) => {
  const [token, setToken] = useState(null);
  const [data, setData] = useState({});
  const [information, setInformation] = useState({});

  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userProfile = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/single-user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData(userProfile.data.user);

      setInformation(userProfile.data.userInfo);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token");

      router.push("/login");
    } catch (error) {
      console.error("Error logout:", error);
    }
  };

  useEffect(() => {
    const checkTokenValidity = () => {
      const savedToken = localStorage.getItem("access_token");
      const expiresAt = localStorage.getItem("expires_at");

      if (savedToken && expiresAt) {
        if (Date.now() > Number(expiresAt)) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("expires_at");
          setToken(null);
        } else {
          setToken(savedToken);
        }
      }
    };

    checkTokenValidity();

    const interval = setInterval(checkTokenValidity, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={Style.profile}>
      <div className={Style.profile_account}>
        <Image
          src={information?.photo ? information.photo : images.avatar}
          alt="user profile"
          width={50}
          height={50}
          className={Style.profile_account_img}
        />

        <div className={Style.profile_account_info}>
          <p>{data.name}</p>
          <small>{data.account?.slice(0, 18)}...</small>
        </div>
      </div>

      {!token ? (
        <div className={Style.profile_menu}>
          <div className={Style.profile_menu_one}>
            <div className={Style.profile_menu_one_item}>
              <TbRegistered />
              <p>
                <Link href={{ pathname: "/signUp" }}>Sign Up</Link>
              </p>
            </div>
            <div className={Style.profile_menu_one_item}>
              <TbLogin />
              <p>
                <Link href={{ pathname: "/login" }}>Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={Style.profile_menu}>
          <div className={Style.profile_menu_one}>
            <div className={Style.profile_menu_one_item}>
              <FaUserAlt />
              <p>
                <Link href={{ pathname: "/author" }}>My Profile</Link>
              </p>
            </div>
            <div className={Style.profile_menu_one_item}>
              <FaUserEdit />
              <p>
                <Link href={{ pathname: "/account" }}>Edit Profile</Link>
              </p>
            </div>
            <div className={Style.profile_menu_one_item}>
              <FaCoins />
              <p>
                <Link href={{ pathname: "/transferToken" }}>
                  Transfer Token
                </Link>
              </p>
            </div>
          </div>
          <div className={Style.profile_menu_two}>
            <div className={Style.profile_menu_one_item}>
              <MdHelpCenter />
              <p>
                <Link href={{ pathname: "/contactus" }}>Help</Link>
              </p>
            </div>
            <div
              className={Style.profile_menu_one_item}
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <TbLogout />
              <p>Logout</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
