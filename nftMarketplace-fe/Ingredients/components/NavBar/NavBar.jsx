import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { MdNotifications } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";

import Style from "./NavBar.module.css";
import { Discover, HelpCenter, Notification, Profile, SideBar } from "./index";
import { Button } from "../componentsindex";
import images from "../../../img";
import { DiJqueryLogo } from "react-icons/di";
import { FaCoins } from "react-icons/fa";

import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

import Error from "../Error/Error";
import axios from "axios";

const NavBar = () => {
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);

  const router = useRouter();

  const discoverRef = useRef(null);
  const helpRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const [account, setAccount] = useState(false);

  const [token, setToken] = useState(null);

  const [information, setInformation] = useState({});

  const [tokenWebBalance, setTokenWebBalance] = useState(0);

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const closeAllDropdowns = () => {
    setDiscover(false);
    setHelp(false);
    setNotification(false);
    setProfile(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (discoverRef.current && !discoverRef.current.contains(event.target)) {
        setDiscover(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setHelp(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotification(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userProfile = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/single-user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const openMenu = (e) => {
    const btnText = e.target.innerText;
    if (btnText == "Discover") {
      setDiscover((prev) => !prev);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    } else if (btnText == "Help Center") {
      setDiscover(false);
      setHelp((prev) => !prev);
      setNotification(false);
      setProfile(false);
    } else {
      closeAllDropdowns();
    }
  };

  const openNotification = () => {
    setNotification((prev) => !prev);
    setDiscover(false);
    setHelp(false);
    setProfile(false);
  };

  const openProfile = () => {
    setProfile((prev) => !prev);
    setHelp(false);
    setDiscover(false);
    setNotification(false);
  };

  const openSideBar = () => {
    setOpenSideMenu((prev) => !prev);
  };

  const {
    currentAccount,
    connectWallet,
    openError,
    tokenBalance,
    tokenSymbol,
  } = useContext(NFTMarketplaceContext);

  const checkAccount = async () => {
    try {
      const reponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/check-account`,
        { account: currentAccount }
      );

      setAccount(reponse.data.exists);
    } catch (error) {
      console.error("Error checking account:", error);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (currentAccount) {
        await checkAccount();

        const balance = await tokenBalance(currentAccount);
        setTokenWebBalance(balance);
      }
    };

    fetchBalance();
  }, [currentAccount]);

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
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div className={Style.logo}>
            <a href="/">
              <DiJqueryLogo className={Style} />
            </a>
          </div>
          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type="text" placeholder="Search NFT" />
              <BsSearch onClick={() => {}} className={Style.search_icon} />
            </div>
          </div>
        </div>

        <div className={Style.navbar_container_right}>
          <div
            className={Style.navbar_container_right_discover}
            ref={discoverRef}
          >
            <p onClick={(e) => openMenu(e)}>Discover</p>
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover token={token} information={information} />
              </div>
            )}
          </div>

          <div className={Style.navbar_container_right_help} ref={helpRef}>
            <p onClick={(e) => openMenu(e)}>Help Center</p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <HelpCenter />
              </div>
            )}
          </div>

          {/* <div
            className={Style.navbar_container_right_notify}
            ref={notificationRef}
          >
            <MdNotifications
              className={Style.notify}
              onClick={() => openNotification()}
            />
            {notification && <Notification />}
          </div> */}

          <div
            className={Style.tokenBalance}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              backgroundColor: "#1a1a1a",
              padding: "6px 12px",
              borderRadius: "12px",
              fontWeight: "700",
              color: "#FFD700",
              lineHeight: 1,
              boxShadow: "0 0 8px rgba(255, 215, 0, 0.2)",
            }}
          >
            <FaCoins
              style={{
                fontSize: "18px",
                verticalAlign: "middle",
                marginBottom: "2px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: "1.1",
              }}
            >
              <span style={{ fontSize: "15px" }}>
                {tokenWebBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#FFD700",
                  opacity: 0.9,
                  marginTop: "-2px",
                }}
              >
                {tokenSymbol}
              </span>
            </div>
          </div>

          <div className={Style.navbar_container_right_button}>
            {!currentAccount ? (
              <Button btnName="Connect" onClick={() => connectWallet()} />
            ) : !account ? (
              <Button
                btnName="Create Account"
                onClick={() => router.push("signUp")}
              />
            ) : !token ? (
              <Button
                btnName="Login Account"
                onClick={() => router.push("login")}
              />
            ) : (
              <Button
                btnName="Create NFT"
                onClick={() => router.push("uploadNFT")}
              />
            )}
          </div>

          <div
            className={Style.navbar_container_right_profile_box}
            ref={profileRef}
          >
            <div className={Style.navbar_container_right_profile}>
              <Image
                src={information?.photo ? information.photo : images.avatar}
                alt="Profile"
                width={40}
                height={40}
                onClick={() => openProfile()}
                className={Style.navbar_container_right_profile}
              />

              {profile && <Profile currentAccount={currentAccount} />}
            </div>
          </div>

          <div className={Style.navbar_container_right_menuBtn}>
            <CgMenuRight
              className={Style.menuIcon}
              onClick={() => openSideBar()}
            />
          </div>
        </div>
      </div>

      {openSideMenu && (
        <div className={Style.sideBar}>
          <SideBar
            setOpenSideMenu={setOpenSideMenu}
            currentAccount={currentAccount}
            connectWallet={connectWallet}
          />
        </div>
      )}

      {openError && <Error />}
    </div>
  );
};

export default NavBar;
