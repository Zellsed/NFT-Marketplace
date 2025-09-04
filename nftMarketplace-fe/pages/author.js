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
} from "../Ingredients/authorPage/componentIndex";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const author = () => {
  const followerArray = [
    {
      background: images.creatorbackground1,
      user: images.user1,
    },
    {
      background: images.creatorbackground2,
      user: images.user2,
    },
    {
      background: images.creatorbackground3,
      user: images.user3,
    },
    {
      background: images.creatorbackground4,
      user: images.user4,
    },
    {
      background: images.creatorbackground5,
      user: images.user5,
    },
  ];

  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);
  const [like, setLike] = useState(false);
  const [follower, setFollower] = useState(false);
  const [following, setFollowing] = useState(false);

  const { fetchMyNFTsOrListedNFTs, currentAccount } = useContext(
    NFTMarketplaceContext
  );

  const [nfts, setNfts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);

  const [token, setToken] = useState(null);
  const [data, setData] = useState({});
  const [information, setInformation] = useState({});

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

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchItemsListed").then((item) => {
      setNfts(item?.reverse());
    });
  }, []);

  useEffect(() => {
    fetchMyNFTsOrListedNFTs("fetchMyNFTs").then((item) => {
      setMyNfts(item?.reverse());
    });
  }, []);

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
    <div className={Style.author}>
      <div className={Style.banner_container}>
        <Banner
          bannerImage={
            information.background ? information.background : images.background
          }
        />
      </div>
      <AuthorProfileCard
        currentAccount={currentAccount}
        information={information}
        token={token}
        data={data}
      />
      <AuthorTaps
        setCollectiables={setCollectiables}
        setCreated={setCreated}
        setLike={setLike}
        setFollower={setFollower}
        setFollowing={setFollowing}
      />
      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        like={like}
        follower={follower}
        following={following}
        nfts={nfts}
        myNfts={myNfts}
        token={token}
      />
      <Title
        heading="Popular Creators"
        paragraph="Popular creators are influential artists, designers, and innovators who have gained recognition for their unique contributions to the digital and creative world. These individuals shape trends, inspire communities, and set new standards in various fields, including digital art, NFTs, music, and content creation.

With their creativity and expertise, popular creators attract large audiences and establish strong personal brands. They leverage platforms like social media, NFT marketplaces, and streaming services to showcase their work and engage with fans.

Many popular creators collaborate with brands, other artists, and technology companies to push creative boundaries. Their work not only captivates audiences but also drives cultural and technological advancements in the digital space."
      />
      <div className={Style.author_box}>
        {followerArray.map((el, i) => (
          <FollowerTabCard i={i} el={el} />
        ))}
      </div>
      <Brand />
    </div>
  );
};

export default author;
