import React, { useState, useEffect, useContext } from "react";

import Style from "../styles/author.module.css";
import {
  Banner,
  NFTCardTwo,
} from "../Ingredients/collectionPage/collectionIndex";
import { Brand, Title } from "../Ingredients/components/componentsindex";
import FollowerTabCard from "../Ingredients/components/FollowerTab/FollowerTabCard/FollowerTabCard";
import images from "../img";
import {
  AuthorProfileCard,
  AuthorTaps,
  AuthorNFTCardBox,
  AuthorProfileUserNft,
} from "../Ingredients/authorPage/componentIndex";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

import { useRouter } from "next/router";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const author = () => {
  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);

  const [user, setUser] = useState({});
  const [userInformation, setUserInformation] = useState({});
  const [listNft, setListNft] = useState([]);

  const [token, setToken] = useState(null);

  const router = useRouter();

  const { seller } = router.query;

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const data = async () => {
    try {
      const reponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user-profile/user-profile-details?account=${seller}`
      );

      setUser(reponse.data.user);

      setUserInformation(reponse.data.userInformation);

      setListNft(reponse.data.listNft);
    } catch (error) {
      console.log("Error while resell", error);
    }
  };

  useEffect(() => {
    if (seller) {
      data();
    }
  }, [seller]);

  return (
    <div className={Style.author}>
      <div className={Style.banner_container}>
        <Banner
          bannerImage={
            userInformation.background
              ? userInformation.background
              : images.background
          }
        />
      </div>
      <AuthorProfileUserNft
        currentAccount={user.account}
        information={userInformation}
        token={token}
        data={user}
      />
      <br />
      <br />
      <br />
      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        like={like}
        follower={follower}
        following={following}
        nfts={listNft}
        myNfts={listNft}
        token={token}
      />
      <Brand />
    </div>
  );
};

export default author;
