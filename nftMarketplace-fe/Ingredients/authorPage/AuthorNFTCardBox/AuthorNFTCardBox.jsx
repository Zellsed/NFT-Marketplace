import React, { useEffect, useState } from "react";

import Style from "./AuthorNFTCardBos.module.css";
import images from "../../../img";
import { NFTCardTwo } from "../../collectionPage/collectionIndex";
import FollowerTabCard from "../../components/FollowerTab/FollowerTabCard/FollowerTabCard";
import axios from "axios";

const AuthorNFTCardBox = ({
  collectiables,
  created,
  like,
  follower,
  following,
  nfts,
  myNfts,
  token,
}) => {
  const [nftLike, setNftLike] = useState([]);
  const [listFollow, setListFollow] = useState([]);
  const [listFollower, setListFollower] = useState([]);

  const fetchLike = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/like/list-nft-like`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNftLike(response.data);

      const listFollow = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/follow/list-following`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setListFollow(listFollow.data);

      const listFollower = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/follow/list-follower`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setListFollower(listFollower.data);
    } catch (error) {
      console.error("Error fetching like:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLike();
    }
  }, [token]);

  return (
    <div className={Style.AuthorNFTCardBox}>
      {collectiables && <NFTCardTwo NFTData={nfts} />}
      {created && <NFTCardTwo NFTData={myNfts} />}

      {like && <NFTCardTwo NFTData={nftLike} />}
      {follower && (
        <div className={Style.AuthorNFTCardBox_box}>
          {listFollow.map((el, i) => (
            <FollowerTabCard i={i} el={el} />
          ))}
        </div>
      )}
      {following && (
        <div className={Style.AuthorNFTCardBox_box}>
          {listFollower.map((el, i) => (
            <FollowerTabCard i={i} el={el} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorNFTCardBox;
