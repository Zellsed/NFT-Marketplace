import React, { useContext, useState, useEffect } from "react";

import Style from "../styles/collection.module.css";
import images from "../img";
import {
  Banner,
  CellectionProfile,
  NFTCardTwo,
} from "../Ingredients/collectionPage/collectionIndex";
import { Slider, Brand } from "../Ingredients/components/componentsindex";
import Filter from "../Ingredients/components/Filter/Filter";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const collection = () => {
  const { fetchNFTs, setError } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    try {
      fetchNFTs().then((item) => {
        setNfts(item?.reverse());
      });
    } catch (error) {
      setError("Please reload the browser");
    }
  }, []);

  return (
    <div className={Style.collection}>
      <div className={Style.banner_container}>
        <Banner bannerImage={images.hqbackground} />
      </div>
      <CellectionProfile />
      <br />
      <br />
      <NFTCardTwo NFTData={nfts?.slice(0, 12)} />
      <Filter />
      <Slider NFTData={nfts} />
      <Brand />
    </div>
  );
};

export default collection;
