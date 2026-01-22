import React, { useEffect, useContext, useState, useMemo } from "react";
import { Loader } from "../../components/componentsindex";
import Style from "./AudioLive.module.css";
import AudioCard from "./AudioCard/AudioCard";
import AudioCardSmall from "./AudioCardSmall/AudioCardSmall";
import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const AudioLive = ({ Tab }) => {
  const { fetchNFTs, fetchNFTs1155 } = useContext(NFTMarketplaceContext);

  const [nftsNew, setNftsNew] = useState([]);
  const [firstNft, setFirstNft] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let res;
        if (Tab === "1155") {
          res = await fetchNFTs1155({ page: 1, limit: 100 });
        } else {
          res = await fetchNFTs({ page: 1, limit: 100 });
        }

        const items = res?.items || [];
        setFirstNft(items);
        setNftsNew(items);
      } catch (error) {
        console.error("Error while fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (Tab) fetchData();
  }, [Tab, fetchNFTs, fetchNFTs1155]);

  const audioFilter = (nft) =>
    nft.category === "Music" &&
    ["mp3", "wav", "ogg"].includes(nft.fileExtension);

  const leftAudios = useMemo(
    () => nftsNew.filter(audioFilter).slice(0, 2),
    [nftsNew],
  );

  const rightAudios = useMemo(
    () => firstNft.filter(audioFilter).slice(0, 3),
    [firstNft],
  );

  const hasData = leftAudios.length > 0 || rightAudios.length > 0;

  return (
    <div className={Style.audioLive}>
      <div className={Style.audioLive_box}>
        {loading ? (
          <div className={Style.audioLive_loader}>
            <Loader />
          </div>
        ) : !hasData ? (
          <div className={Style.audioLive_empty}>
            <div className={Style.audioLive_empty_box}>
              <span className={Style.audioLive_empty_icon}>🎵</span>
              <h3>Chưa có NFT âm thanh</h3>
              <p>
                Hiện tại chưa có nội dung âm thanh nào cho loại NFT này.
                <br />
                Vui lòng thử lại với tab khác.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className={Style.audioLive_box_left}>
              {leftAudios.map((nft, index) => (
                <AudioCard key={index} NFTData={nft} Tab={Tab} />
              ))}
            </div>

            <div className={Style.audioLive_box_right}>
              {rightAudios.map((nft, index) => (
                <AudioCardSmall key={index} NFTData={nft} Tab={Tab} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioLive;
