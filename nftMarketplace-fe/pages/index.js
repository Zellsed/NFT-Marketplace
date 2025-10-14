import React, { useContext, useEffect, useState } from "react";

import Style from "../styles/index.module.css";
import {
  HeroSection,
  Service,
  BigNFTSilder,
  Subscribe,
  Title,
  Category,
  Filter,
  NFTCard,
  Collection,
  FollowerTab,
  AudioLive,
  Slider,
  Brand,
  Video,
  Loader,
} from "../Ingredients/components/componentsindex";

import { getTopCreators } from "../Ingredients/TopCreators/TopCreators";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const Home = () => {
  const { checkIfWalletIsConnected } = useContext(NFTMarketplaceContext);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);

  const creators = getTopCreators(nfts);

  useEffect(() => {
    fetchNFTs().then((items) => {
      setNfts(items?.reverse());
      setNftsCopy(items);
    });
  }, []);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      {/* <BigNFTSilder /> */}
      <Title
        heading="Audio Collection"
        paragraph="Audio Collection is a dedicated collection of NFTs for audio-based creations, including digital music, podcasts, sound effects, and other exclusive audio content. It offers artists, music producers, and content creators a unique way to share and monetize their recordings through blockchain technology."
      />
      <AudioLive />
      {/* {creators.length === 0 ? (
        <Loader />
      ) : (
        <FollowerTab TopCreator={creators} />
      )} */}
      <Slider NFTData={nfts} />
      {/* <Collection /> */}
      <Title
        heading="Featured NFTs"
        paragraph="Discover the most outstanding NFTs in all topics of life."
      />
      <Filter />
      {nfts?.length === 0 ? <Loader /> : <NFTCard NFTData={nfts} />}
      <Title
        heading="Browse by category"
        paragraph="Explore the NFTs in the most featured categories."
      />
      <Category />
      <Brand />
      <Video />
    </div>
  );
};

export default Home;
