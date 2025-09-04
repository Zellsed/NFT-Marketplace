import React, { useEffect, useState, useContext } from "react";

import Style from "../styles/searchPage.module.css";
import {
  Slider,
  Brand,
  Loader,
} from "../Ingredients/components/componentsindex";
import { SearchBar } from "../Ingredients/SearchPage/SearchBarIndex";
import { Filter } from "../Ingredients/components/componentsindex";
import {
  NFTCardTwo,
  Banner,
} from "../Ingredients/collectionPage/collectionIndex";
import images from "../img/index";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const searchPage = () => {
  const { fetchNFTs, setError } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  useEffect(() => {
    try {
      fetchNFTs().then((item) => {
        setNfts(item?.reverse());
        setNftsCopy(item);
      });
    } catch (error) {
      setError("Please reload the browser");
    }
  }, []);

  const onHandleSearch = (value) => {
    const filteredNFTs = nftsCopy.filter((nft) =>
      nft.name.toLowerCase().includes(value.toLowerCase())
    );
    if (filteredNFTs.length === 0) {
      setNfts(nftsCopy);
    } else {
      setNfts(filteredNFTs);
    }
  };

  const onClearSearch = () => {
    if (nftsCopy.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  return (
    <div className={Style.searchPage}>
      <div className={Style.banner_container}>
        <Banner bannerImage={images.hqbackground} />
      </div>
      <SearchBar
        onHandleSearch={onHandleSearch}
        onClearSearch={onClearSearch}
      />
      <Filter />
      {nfts?.length == 0 ? <Loader /> : <NFTCardTwo NFTData={nfts} />}
      <Slider NFTData={nfts} />
      <Brand />
    </div>
  );
};

export default searchPage;
