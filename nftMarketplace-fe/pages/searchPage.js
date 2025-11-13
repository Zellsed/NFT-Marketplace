import React, { useEffect, useState, useContext } from "react";
import Style from "../styles/searchPage.module.css";
import {
  Slider,
  Brand,
  Loader,
  Filter,
} from "../Ingredients/components/componentsindex";
import { SearchBar } from "../Ingredients/SearchPage/SearchBarIndex";
import {
  NFTCollectionCardTwo,
  NFTCardTwo,
  Banner,
} from "../Ingredients/collectionPage/collectionIndex";
import images from "../img/index";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const SearchPage = () => {
  const { fetchNFTs, fetchNFTs1155, setError } = useContext(
    NFTMarketplaceContext
  );

  const [nfts721, setNfts721] = useState([]);
  const [nfts721Copy, setNfts721Copy] = useState([]);
  const [nfts1155, setNfts1155] = useState([]);
  const [nfts1155Copy, setNfts1155Copy] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setLoading(true);
        const items721 = await fetchNFTs();
        const items1155 = await fetchNFTs1155();

        setNfts721(items721 || []);
        setNfts721Copy(items721 || []);
        setNfts1155(items1155 || []);
        setNfts1155Copy(items1155 || []);
      } catch (error) {
        console.error(error);
        setError("Please reload the browser");
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, []);

  const onHandleSearch = (value) => {
    const query = value.toLowerCase();

    const filtered721 = nfts721Copy.filter((nft) =>
      nft.name.toLowerCase().includes(query)
    );
    const filtered1155 = nfts1155Copy.filter((nft) =>
      nft.name.toLowerCase().includes(query)
    );

    setNfts721(filtered721);
    setNfts1155(filtered1155);
  };

  const onClearSearch = () => {
    setNfts721(nfts721Copy);
    setNfts1155(nfts1155Copy);
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

      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className={Style.sectionTitle}>ERC-721 NFTs</h2>
          {nfts721.length > 0 ? (
            <NFTCardTwo NFTData={nfts721} />
          ) : (
            <p className={Style.noNFTText}>No ERC-721 NFTs found</p>
          )}

          <h2 className={Style.sectionTitle}>ERC-1155 NFTs</h2>
          {nfts1155.length > 0 ? (
            <NFTCollectionCardTwo NFTData={nfts1155} />
          ) : (
            <p className={Style.noNFTText}>No ERC-1155 NFTs found</p>
          )}

          {/* <Slider NFTData={[...nfts721, ...nfts1155]} /> */}
          <Brand />
        </>
      )}
    </div>
  );
};

export default SearchPage;
