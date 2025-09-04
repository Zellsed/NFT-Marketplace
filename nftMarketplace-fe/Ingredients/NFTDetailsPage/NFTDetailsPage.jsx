import React, { useEffect, useState } from "react";

import { NFTDescription, NFTDetailsImg, NFTTabs } from "./NFTDetailsIndex";

import Style from "./NFTDetailsPage.module.css";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const NFTDetailsPage = ({ nft }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [userInformation, setUserInformation] = useState({});

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const fetchAccount = async (account) => {
    try {
      const userProfile = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/account-details?account=${account}`
      );

      setUser(userProfile.data.user);

      setUserInformation(userProfile.data.userInformation);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (nft.seller === "0x0000000000000000000000000000000000000000") {
      fetchAccount(nft.owner);
    } else {
      fetchAccount(nft.seller);
    }
  }, [nft]);

  return (
    <div className={Style.NFTDetailsPage}>
      <div className={Style.NFTDetailsPage_box}>
        <NFTDetailsImg nft={nft} token={token} />
        <NFTDescription
          nft={nft}
          userInformation={userInformation}
          user={user}
          token={token}
        />
      </div>
    </div>
  );
};

export default NFTDetailsPage;
