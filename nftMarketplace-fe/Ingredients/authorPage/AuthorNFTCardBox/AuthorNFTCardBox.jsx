import React from "react";
import Style from "./AuthorNFTCardBos.module.css";
import {
  NFTCardTwo,
  NFTCollectionCardTwo,
} from "../../collectionPage/collectionIndex";

const Pagination = ({ page, totalPages, setPage }) => (
  <div className={Style.pagination}>
    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
      Trước
    </button>
    <span>
      {page} / {totalPages}
    </span>
    <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
      Tiếp
    </button>
  </div>
);

const AuthorNFTCardBox = ({
  collectiables,
  created,
  nfts721,
  nfts1155,
  myNfts721,
  myNfts1155,
  page721,
  totalPages721,
  setPage721,
  page1155,
  totalPages1155,
  setPage1155,
}) => {
  const renderSection = (title, erc721, erc1155) => (
    <section className={Style.nftSection}>
      <h2 className={Style.sectionTitle}>{title}</h2>

      <h3 className={Style.standardTitle}>ERC-721</h3>
      {erc721.length ? (
        <>
          <NFTCardTwo NFTData={erc721} />
          <Pagination
            page={page721}
            totalPages={totalPages721}
            setPage={setPage721}
          />
        </>
      ) : (
        <p className={Style.emptyText}>Không có NFT ERC-721</p>
      )}

      <h3 className={Style.standardTitle}>ERC-1155</h3>
      {erc1155.length ? (
        <>
          <NFTCollectionCardTwo NFTData={erc1155} />
          <Pagination
            page={page1155}
            totalPages={totalPages1155}
            setPage={setPage1155}
          />
        </>
      ) : (
        <p className={Style.emptyText}>Không có NFT ERC-1155</p>
      )}
    </section>
  );

  return (
    <div className={Style.AuthorNFTCardBox}>
      {collectiables &&
        renderSection("🛒 NFT được niêm yết", nfts721, nfts1155)}

      {created && renderSection("🎨 NFT sở hữu", myNfts721, myNfts1155)}
    </div>
  );
};

export default AuthorNFTCardBox;
