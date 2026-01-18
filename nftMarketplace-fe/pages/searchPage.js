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
    NFTMarketplaceContext,
  );

  const [nfts721, setNfts721] = useState([]);
  const [nfts721Copy, setNfts721Copy] = useState([]);
  const [nfts1155, setNfts1155] = useState([]);
  const [nfts1155Copy, setNfts1155Copy] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [page1155, setPage1155] = useState(1);
  const [totalPages1155, setTotalPages1155] = useState(1);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        setLoading(true);
        const items721 = await fetchNFTs({ page, limit: 3 });
        const items1155 = await fetchNFTs1155({ page, limit: 3 });
        console.log("items1155", items1155);

        setNfts721(items721.items || []);
        setNfts721Copy(items721.items || []);
        setTotalPages(items721.totalPages || 1);

        setNfts1155(items1155.items || []);
        setNfts1155Copy(items1155.items || []);
        setTotalPages1155(items1155.totalPages || 1);
      } catch (error) {
        console.error(error);
        setError("Please reload the browser");
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [page]);

  const onHandleSearch = (value) => {
    const query = value.toLowerCase();

    const filtered721 = nfts721Copy.filter((nft) =>
      nft.name.toLowerCase().includes(query),
    );
    const filtered1155 = nfts1155Copy.filter((nft) =>
      nft.name.toLowerCase().includes(query),
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
          <h2 className={Style.sectionTitle}>NFT ERC-721</h2>
          {nfts721.length > 0 ? (
            <NFTCardTwo NFTData={nfts721} />
          ) : (
            <p className={Style.noNFTText}>Không tìm thấy NFT ERC-721 nào.</p>
          )}

          <div className={Style.pagination}>
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>

          <h2 className={Style.sectionTitle}>NFT ERC-1155</h2>
          {nfts1155.length > 0 ? (
            <NFTCollectionCardTwo NFTData={nfts1155} />
          ) : (
            <p className={Style.noNFTText}>Không tìm thấy NFT ERC-1155 nào.</p>
          )}

          <div className={Style.pagination}>
            <button
              disabled={page1155 === 1}
              onClick={() => setPage1155((p) => p - 1)}
            >
              Prev
            </button>

            <span>
              {page1155} / {totalPages1155}
            </span>

            <button
              disabled={page1155 === totalPages1155}
              onClick={() => setNfts1155((p) => p + 1)}
            >
              Next
            </button>
          </div>
          <Brand />
        </>
      )}
    </div>
  );
};

export default SearchPage;
