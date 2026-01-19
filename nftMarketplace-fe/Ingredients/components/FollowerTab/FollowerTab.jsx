import React, { useState, useEffect } from "react";
import {
  RiUserFollowFill,
  RiUserUnfollowFill,
  RiAwardLine,
} from "react-icons/ri";

import Style from "./FollowerTab.module.css";
import FollowerTabCard from "./FollowerTabCard/FollowerTabCard";
import images from "../../../img";

const FollowerTab = ({ TopCreator }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const [popular, setPopular] = useState(true);
  const [following, setFollowing] = useState(false);
  const [news, setNews] = useState(false);

  const openPopular = () => {
    if (!popular) {
      setPopular(true);
      setFollowing(false);
      setNews(false);
    }
  };

  const openFollower = () => {
    if (!following) {
      setPopular(false);
      setFollowing(true);
      setNews(false);
    }
  };

  const openNows = () => {
    if (!news) {
      setPopular(false);
      setFollowing(false);
      setNews(true);
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
    <div className={Style.followerTab}>
      <div className={Style.followerTab_title}>
        <h2>Danh sách những người sáng tạo hàng đầu.</h2>
        <div className={Style.followerTab_tabs}>
          <div className={Style.followerTab_tabs_btn}>
            <button onClick={() => openPopular()}>
              <RiUserFollowFill /> Phổ biến
            </button>

            {/* <button onClick={() => openFollower()}>
              <RiUserFollowFill /> Following
            </button> */}

            {/* <button onClick={() => openNows()}>
              <RiAwardLine /> NoteWorthy
            </button> */}
          </div>
        </div>
      </div>

      {popular && (
        <div className={Style.followerTab_box}>
          {TopCreator.map((el, i) => (
            <FollowerTabCard key={i + 1} i={i} el={el} />
          ))}
        </div>
      )}

      {/* {following && (
        <div className={Style.followerTab_box}>
          {FollowingArray.map((el, i) => (
            <FollowerTabCard key={i + 1} i={i} el={el} />
          ))}
        </div>
      )} */}

      {/* {news && (
        <div className={Style.followerTab_box}>
          {NewsArray.map((el, i) => (
            <FollowerTabCard key={i + 1} i={i} el={el} />
          ))}
        </div>
      )} */}
    </div>
  );
};

export default FollowerTab;
