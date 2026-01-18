import React, { useState, useEffect, useContext, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { MdNotifications, MdAdminPanelSettings } from "react-icons/md";
import { BsChevronDown, BsSearch } from "react-icons/bs";
import { CgMenuLeft, CgMenuRight } from "react-icons/cg";

import Style from "./NavBar.module.css";
import { Discover, HelpCenter, Notification, Profile, SideBar } from "./index";
import { Button } from "../componentsindex";
import images from "../../../img";
import { DiJqueryLogo } from "react-icons/di";
import { FaCoins, FaLock } from "react-icons/fa";

import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";
import { DeployerAddress } from "../../../Context/constant";

import TokenAmount, {
  formatRawValue,
} from "../../../Ingredients/components/formatTokenAmount/TokenAmount";

import Error from "../Error/Error";
import axios from "axios";

const NavBar = () => {
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [createMenu, setCreateMenu] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const router = useRouter();

  const discoverRef = useRef(null);
  const helpRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const createMenuRef = useRef(null);

  const [account, setAccount] = useState(false);
  const [token, setToken] = useState(null);
  const [information, setInformation] = useState({});
  const [tokenWebBalance, setTokenWebBalance] = useState(0);

  const {
    currentAccount,
    connectWallet,
    openError,
    tokenBalance,
    tokenSymbol,
    baseCoinNetwork,
    setShowNetworkModal,
  } = useContext(NFTMarketplaceContext);

  useEffect(() => {
    if (currentAccount && DeployerAddress) {
      const isAdminUser =
        currentAccount.toLowerCase() === DeployerAddress.toLowerCase();
      setIsAdmin(isAdminUser);
    } else {
      setIsAdmin(false);
    }
  }, [currentAccount]);

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
    setCreateMenu(false);
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
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target)
      ) {
        setCreateMenu(false);
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
    if (btnText == "Khám phá") {
      setDiscover((prev) => !prev);
      setHelp(false);
      setNotification(false);
      setProfile(false);
      setCreateMenu(false);
    } else if (btnText == "Trung tâm hỗ trợ") {
      setDiscover(false);
      setHelp((prev) => !prev);
      setNotification(false);
      setProfile(false);
      setCreateMenu(false);
    } else {
      closeAllDropdowns();
    }
  };

  const openNotification = () => {
    setNotification((prev) => !prev);
    setDiscover(false);
    setHelp(false);
    setProfile(false);
    setCreateMenu(false);
  };

  const openProfile = () => {
    setProfile((prev) => !prev);
    setHelp(false);
    setDiscover(false);
    setNotification(false);
    setCreateMenu(false);
  };

  const openCreateMenu = () => {
    if (!currentAccount) {
      alert("Please connect wallet");
      return;
    }

    if (!account) {
      alert("Please create an account");
      router.push("/signUp");
      return;
    }

    if (!token) {
      alert("Please login");
      router.push("/login");
      return;
    }

    setCreateMenu((prev) => !prev);
    setHelp(false);
    setDiscover(false);
    setNotification(false);
    setProfile(false);
  };

  const openSideBar = () => {
    setOpenSideMenu((prev) => !prev);
  };

  const checkAccount = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/check-account`,
        { account: currentAccount }
      );
      setAccount(response.data.exists);
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

  const CreateMenu = () => (
    <div className={Style.create_menu_box}>
      <div
        className={Style.create_menu_item}
        onClick={() => {
          router.push("uploadNFT");
          setCreateMenu(false);
        }}
      >
        Tạo NFT
      </div>
      <div
        className={Style.create_menu_item}
        onClick={() => {
          router.push("uploadNFTCollection");
          setCreateMenu(false);
        }}
      >
        Tạo bộ sưu tập NFT
      </div>
    </div>
  );

  const isActive = (path) => router.pathname === path;

  const handleProtectedRoute = (path) => {
    if (!currentAccount) {
      alert("Please connect wallet");
      return;
    }

    if (!account) {
      alert("Please create an account");
      router.push("/signUp");
      return;
    }

    if (!token) {
      alert("Please login");
      router.push("/login");
      return;
    }

    router.push(path);
  };

  const handleAdminRoute = () => {
    if (!currentAccount) {
      alert("Please connect wallet");
      return;
    }

    if (!account) {
      alert("Please create an account");
      router.push("/signUp");
      return;
    }

    if (!token) {
      alert("Please login");
      router.push("/login");
      return;
    }

    if (!isAdmin) {
      alert("Access denied. Admin only.");
      return;
    }

    router.push("/admin");
  };

  return (
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div className={Style.logo}>
            <a href="/">
              <DiJqueryLogo className={Style.logo_icon} />
            </a>
          </div>
          <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input
                type="text"
                placeholder="Tìm kiếm NFT, bộ sưu tập, tài khoản..."
              />
              <BsSearch className={Style.search_icon} />
            </div>
          </div>
        </div>

        <div className={Style.navbar_container_right}>
          <div className={Style.navbar_nav_items}>
            <div
              className={Style.navbar_container_right_discover}
              ref={discoverRef}
            >
              <p onClick={(e) => openMenu(e)} className={Style.nav_item}>
                Khám phá
                <BsChevronDown
                  className={`${Style.chevron} ${
                    discover ? Style.chevron_rotated : ""
                  }`}
                />
              </p>
              {discover && (
                <div className={Style.navbar_container_right_discover_box}>
                  <Discover token={token} information={information} />
                </div>
              )}
            </div>

            {isAdmin && (
              <p
                className={`${Style.nav_item} ${Style.admin_nav_item} ${
                  isActive("/admin") ? Style.active : ""
                }`}
                onClick={handleAdminRoute}
              >
                <MdAdminPanelSettings className={Style.admin_icon} />
                Quản trị viên
              </p>
            )}

            <p
              className={`${Style.nav_item} ${
                isActive("/staking") ? Style.active : ""
              }`}
              onClick={() => handleProtectedRoute("/staking")}
            >
              <FaLock className={Style.staking_icon} />
              Đặt cược NFT
            </p>

            <div className={Style.navbar_container_right_help} ref={helpRef}>
              <p onClick={(e) => openMenu(e)} className={Style.nav_item}>
                Trung tâm hỗ trợ
                <BsChevronDown
                  className={`${Style.chevron} ${
                    help ? Style.chevron_rotated : ""
                  }`}
                />
              </p>
              {help && (
                <div className={Style.navbar_container_right_help_box}>
                  <HelpCenter />
                </div>
              )}
            </div>
          </div>

          <div
            className={Style.tokenBalance}
            onClick={() => handleProtectedRoute("/transferToken")}
            style={{ cursor: "pointer" }}
          >
            <FaCoins className={Style.coin_icon} />
            <div className={Style.token_balance_info}>
              <span className={Style.token_amount}>
                <TokenAmount amount={tokenWebBalance} />
              </span>
              <span className={Style.token_symbol}>{tokenSymbol}</span>
            </div>
          </div>

          <div className={Style.network_switcher}>
            <button
              onClick={() => setShowNetworkModal(true)}
              className={Style.network_button}
              title="Switch Network"
            >
              {baseCoinNetwork || "Select Network"}
            </button>
          </div>

          <div className={Style.navbar_actions}>
            {!currentAccount ? (
              <Button
                btnName="Connect"
                onClick={() => connectWallet()}
                className={Style.connect_btn}
              />
            ) : !account ? (
              <Button
                btnName="Create Account"
                onClick={() => router.push("signUp")}
                className={Style.create_account_btn}
              />
            ) : !token ? (
              <Button
                btnName="Login"
                onClick={() => router.push("login")}
                className={Style.login_btn}
              />
            ) : (
              <div
                className={Style.create_button_container}
                ref={createMenuRef}
              >
                <Button
                  btnName={
                    <div className={Style.create_btn_content}>
                      Tạo
                      <BsChevronDown
                        className={`${Style.chevron} ${
                          createMenu ? Style.chevron_rotated : ""
                        }`}
                      />
                    </div>
                  }
                  onClick={openCreateMenu}
                  className={Style.create_btn}
                />
                {createMenu && <CreateMenu />}
              </div>
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
                width={44}
                height={44}
                onClick={() => openProfile()}
                className={Style.profile_image}
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
            isAdmin={isAdmin}
            handleAdminRoute={handleAdminRoute}
          />
        </div>
      )}

      {openError && <Error />}
    </div>
  );
};

export default NavBar;
