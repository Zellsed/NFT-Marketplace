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

  const creators = getTopCreators(nfts.items);

  useEffect(() => {
    fetchNFTs({ page: 1, limit: 100 }).then((items) => {
      setNfts(items);
      setNftsCopy(items);
    });
  }, []);

  return (
    <div className={Style.homePage}>
      <HeroSection />
      <Service />
      <BigNFTSilder />
      <Title
        heading="Bộ sưu tập âm thanh"
        paragraph="Bộ sưu tập NFT chuyên biệt dành cho các sáng tạo dựa trên âm thanh, bao gồm nhạc số, podcast, hiệu ứng âm thanh và nhiều nội dung âm thanh độc quyền khác. Bộ sưu tập này mang đến cho nghệ sĩ, nhà sản xuất âm nhạc và người sáng tạo nội dung một cách thức độc đáo để chia sẻ và kiếm tiền từ các bản ghi của họ thông qua công nghệ blockchain."
      />
      <AudioLive />
      {creators.length === 0 ? (
        <Loader />
      ) : (
        <FollowerTab TopCreator={creators} />
      )}
      <Slider NFTData={nfts.items} />
      {/* <Collection /> */}
      <Title
        heading="NFT nổi bật"
        paragraph="Khám phá những NFT nổi bật nhất trong mọi lĩnh vực của cuộc sống."
      />
      <Filter />
      {nfts.items?.length === 0 ? <Loader /> : <NFTCard NFTData={nfts.items} />}
      {/* <Title
        heading="Duyệt theo danh mục"
        paragraph="Khám phá các NFT trong những danh mục nổi bật nhất."
      /> */}
      <Brand />
    </div>
  );
};

export default Home;
