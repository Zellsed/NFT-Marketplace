import React, { useEffect, useState } from "react";
import Style from "./AuthorNFTCardBos.module.css";
import {
  NFTCardTwo,
  NFTCard,
  NFTCollectionCardTwo,
  NFTCollectionOwnerNft,
} from "../../collectionPage/collectionIndex";
import FollowerTabCard from "../../components/FollowerTab/FollowerTabCard/FollowerTabCard";

const AuthorNFTCardBox = ({
  collectiables,
  created,
  like,
  follower,
  following,
  nfts,
  myNfts,
  nfts1155,
  myNfts1155,
  token,
}) => {
  const [nftLike, setNftLike] = useState([]);
  const [listFollow, setListFollow] = useState([]);
  const [listFollower, setListFollower] = useState([]);

  const listedNFTsData = {
    erc721: Array.isArray(nfts) ? nfts.filter((item) => item !== null) : [],
    erc1155: Array.isArray(nfts1155)
      ? nfts1155.filter((item) => item !== null)
      : [],

    title: "🛒 Listed NFTs",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    emptyText: "No NFTs listed on marketplace",
  };

  const ownedNFTsData = {
    erc721: Array.isArray(myNfts) ? myNfts.filter((item) => item !== null) : [],
    erc1155: Array.isArray(nfts1155)
      ? nfts1155.filter((item) => item !== null)
      : [],

    title: "🎨 Owned NFTs",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    emptyText: "No NFTs in your collection",
  };

  const renderNFTSection = (data, isListed = false) => {
    const hasERC721 = data.erc721.length > 0;
    const hasERC1155 = data.erc1155.length > 0;
    const hasAnyNFT = hasERC721 || hasERC1155;

    return (
      <div className={Style.nftSection}>
        <div className={Style.sectionHeader}>
          <h2 className={Style.sectionTitle}>{data.title}</h2>
          <p className={Style.sectionDescription}>{data.description}</p>
        </div>

        {hasAnyNFT ? (
          <div className={Style.nftGrid}>
            {hasERC721 && (
              <div className={Style.tokenStandardSection}>
                <h3 className={Style.tokenStandardTitle}>ERC-721 NFTs</h3>
                <NFTCardTwo NFTData={data.erc721} />
              </div>
            )}

            {hasERC1155 && (
              <div className={Style.tokenStandardSection}>
                <h3 className={Style.tokenStandardTitle}>ERC-1155 NFTs</h3>
                <NFTCollectionCardTwo
                  NFTData={isListed ? data.erc1155 : myNfts1155}
                />
              </div>
            )}
          </div>
        ) : (
          <div className={Style.emptyState}>
            <p className={Style.emptyText}>{data.emptyText}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={Style.AuthorNFTCardBox}>
      {(collectiables || created) && (
        <div className={Style.nftSections}>
          {collectiables && renderNFTSection(listedNFTsData, true)}

          {created && renderNFTSection(ownedNFTsData, false)}
        </div>
      )}

      {like && nftLike.length > 0 && (
        <div className={Style.nftSection}>
          <h2 className={Style.mainTitle}>Liked NFTs</h2>
          <NFTCardTwo NFTData={nftLike} />
        </div>
      )}

      {follower && listFollow.length > 0 && (
        <div className={Style.AuthorNFTCardBox_box}>
          <h2 className={Style.mainTitle}>Following</h2>
          {listFollow.map((el, i) => (
            <FollowerTabCard key={i} i={i} el={el} />
          ))}
        </div>
      )}

      {following && listFollower.length > 0 && (
        <div className={Style.AuthorNFTCardBox_box}>
          <h2 className={Style.mainTitle}>Followers</h2>
          {listFollower.map((el, i) => (
            <FollowerTabCard key={i} i={i} el={el} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorNFTCardBox;
