import React, { useEffect, useContext, useState } from "react";
import { Loader } from "../../components/componentsindex";
import Style from "./AudioLive.module.css";
import AudioCard from "./AudioCard/AudioCard";
import AudioCardSmall from "./AudioCardSmall/AudioCardSmall";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const AudioLive = () => {
  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nftsNew, setNftsNew] = useState([]);
  const [fistNft, setFistNft] = useState([]);

  useEffect(() => {
    fetchNFTs().then((item) => {
      setFistNft(item?.reverse());
      setNftsNew(item?.reverse());
    });
  }, []);

  return (
    <div className={Style.audioLive}>
      <div className={Style.audioLive_box}>
        <div className={Style.audioLive_box_left}>
          {nftsNew?.length === 0 ? (
            <Loader />
          ) : (
            nftsNew
              ?.filter((nft) => nft.category === "Music")
              .slice(0, 2)
              .map((nft, index) => <AudioCard key={index} NFTData={nft} />)
          )}
        </div>
        <div className={Style.audioLive_box_right}>
          {fistNft?.length === 0 ? (
            <Loader />
          ) : (
            fistNft
              ?.filter((nft) => nft.category === "Music")
              .slice(0, 3)
              .map((nft, index) => <AudioCardSmall key={index} NFTData={nft} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioLive;
