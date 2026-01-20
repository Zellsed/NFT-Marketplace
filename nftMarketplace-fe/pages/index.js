import React, { useContext, useEffect, useMemo, useState } from "react";

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
  const { checkIfWalletIsConnected, fetchNFTs, fetchNFTs1155 } = useContext(
    NFTMarketplaceContext,
  );

  const [nfts721, setNfts721] = useState([]);
  const [nfts1155, setNfts1155] = useState([]);
  const [loading721, setLoading721] = useState(true);
  const [loading1155, setLoading1155] = useState(true);
  const [activeTab, setActiveTab] = useState("721");

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const load721 = async () => {
      try {
        const res = await fetchNFTs({ page: 1, limit: 100 });
        setNfts721(res?.items || []);
      } catch (error) {
        console.error("Error while fetching NFTs:", error);
      } finally {
        setLoading721(false);
      }
    };
    load721();
  }, []);

  useEffect(() => {
    const load1155 = async () => {
      try {
        const res = await fetchNFTs1155({ page: 1, limit: 100 });
        setNfts1155(res?.items || []);
      } catch (error) {
        console.error("Error while fetching NFTs:", error);
      } finally {
        setLoading1155(false);
      }
    };
    load1155();
  }, []);

  const currentNFTs = activeTab === "721" ? nfts721 : nfts1155;
  const isLoading = activeTab === "721" ? loading721 : loading1155;

  const creators = useMemo(() => getTopCreators(currentNFTs), [currentNFTs]);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />

      <div className={Style.toggleContainer}>
        <div className={Style.toggleBox}>
          <button
            className={activeTab === "721" ? Style.activeBtn : ""}
            onClick={() => setActiveTab("721")}
          >
            ERC-721
          </button>
          <button
            className={activeTab === "1155" ? Style.activeBtn : ""}
            onClick={() => setActiveTab("1155")}
          >
            ERC-1155
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={Style.loaderCenter}>
          <Loader />
          <p>Đang tải dữ liệu {activeTab}...</p>
        </div>
      ) : (
        <>
          <BigNFTSilder Tab={activeTab} />
          <Title
            heading="Bộ sưu tập âm thanh"
            paragraph="Bộ sưu tập NFT chuyên biệt dành cho các sáng tạo dựa trên âm thanh, bao gồm nhạc số, podcast, hiệu ứng âm thanh và nhiều nội dung âm thanh độc quyền khác. Bộ sưu tập này mang đến cho nghệ sĩ, nhà sản xuất âm nhạc và người sáng tạo nội dung một cách thức độc đáo để chia sẻ và kiếm tiền từ các bản ghi của họ thông qua công nghệ blockchain."
          />
          <AudioLive Tab={activeTab} />
          {creators.length === 0 ? (
            <Loader />
          ) : (
            <FollowerTab TopCreator={creators} />
          )}
          <Title
            heading="Khám phá NFT Video"
            paragraph="Nhấn vào biểu tượng phát và thưởng thức các NFT video."
          />
          <Slider NFTData={currentNFTs} />
          <Title
            heading="NFT nổi bật"
            paragraph="Khám phá những NFT nổi bật nhất trong mọi lĩnh vực của cuộc sống."
          />
          <NFTCard NFTData={currentNFTs} />
          <Brand />
        </>
      )}
    </div>
  );
};

export default Home;
