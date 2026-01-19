import React, { useState, useEffect, useContext } from "react";
import Style from "../styles/author.module.css";
import images from "../img";

import {
  AuthorProfileCard,
  AuthorTaps,
  AuthorNFTCardBox,
} from "../Ingredients/authorPage/componentIndex";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import axios from "axios";
import { Banner } from "../Ingredients/collectionPage/collectionIndex";
import { Brand, Filter } from "../Ingredients/components/componentsindex";

const author = () => {
  const [collectiables, setCollectiables] = useState(true);
  const [created, setCreated] = useState(false);

  const {
    fetchMyNFTsOrListedNFTs,
    fetchMyNFTsOrListedNFTs1155,
    currentAccount,
  } = useContext(NFTMarketplaceContext);

  const [nfts721, setNfts721] = useState([]);
  const [nfts1155, setNfts1155] = useState([]);
  const [myNfts721, setMyNfts721] = useState([]);
  const [myNfts1155, setMyNfts1155] = useState([]);

  const [page721, setPage721] = useState(1);
  const [totalPages721, setTotalPages721] = useState(1);

  const [page1155, setPage1155] = useState(1);
  const [totalPages1155, setTotalPages1155] = useState(1);

  const limit = 8;

  const [token, setToken] = useState(null);
  const [data, setData] = useState({});
  const [information, setInformation] = useState({});

  const [category, setCategory] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/single-user`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setData(res.data.user);
        setInformation(res.data.userInfo);
      });
  }, [token]);

  useEffect(() => {
    if (!token || !collectiables) return;

    fetchMyNFTsOrListedNFTs(
      "fetchItemsListed",
      token,
      page721,
      limit,
      category,
    ).then((res) => {
      setNfts721(res.items || []);
      setTotalPages721(res.totalPages || 1);
    });
  }, [token, page721, collectiables, category]);

  useEffect(() => {
    if (!token || !collectiables) return;

    fetchMyNFTsOrListedNFTs1155(
      "fetchItemsListed",
      token,
      page1155,
      limit,
      category,
    ).then((res) => {
      setNfts1155(res.items || []);
      setTotalPages1155(res.totalPages || 1);
    });
  }, [token, page1155, collectiables, category]);

  useEffect(() => {
    if (!token || !created) return;

    fetchMyNFTsOrListedNFTs(
      "fetchMyNFTs",
      token,
      page721,
      limit,
      category,
    ).then((res) => setMyNfts721(res.items || []));

    fetchMyNFTsOrListedNFTs1155(
      "fetchMyNFTs",
      token,
      page1155,
      limit,
      category,
    ).then((res) => setMyNfts1155(res.items || []));
  }, [token, created, page721, page1155, category]);

  const onSelectCategory = (cat) => {
    setCategory(cat);
    setPage721(1);
    setPage1155(1);
  };

  return (
    <div className={Style.author}>
      <div className={Style.banner_container}>
        <Banner bannerImage={information.background || images.background} />
      </div>

      <AuthorProfileCard
        currentAccount={currentAccount}
        information={information}
        token={token}
        data={data}
      />

      <AuthorTaps setCollectiables={setCollectiables} setCreated={setCreated} />

      <Filter onSelectCategory={onSelectCategory} />

      <AuthorNFTCardBox
        collectiables={collectiables}
        created={created}
        nfts721={nfts721}
        nfts1155={nfts1155}
        myNfts721={myNfts721}
        myNfts1155={myNfts1155}
        page721={page721}
        totalPages721={totalPages721}
        setPage721={setPage721}
        page1155={page1155}
        totalPages1155={totalPages1155}
        setPage1155={setPage1155}
      />

      <Brand />
    </div>
  );
};

export default author;
