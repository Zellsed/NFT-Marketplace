import React, { useEffect, useState } from "react";
import Style from "./AuthorNFTCardBos.module.css";
import { NFTCardTwo, NFTCard } from "../../collectionPage/collectionIndex";
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

  const getDisplayData = () => {
    if (collectiables) {
      return {
        erc721: Array.isArray(nfts) ? nfts.filter((item) => item !== null) : [],
        erc1155: Array.isArray(nfts1155)
          ? nfts1155.filter((item) => item !== null)
          : [],
        title: "Listed NFTs",
      };
    } else if (created) {
      return {
        erc721: Array.isArray(myNfts)
          ? myNfts.filter((item) => item !== null)
          : [],
        erc1155: Array.isArray(myNfts1155)
          ? myNfts1155.filter((item) => item !== null)
          : [],
        title: "Own NFT",
      };
    }
    return { erc721: [], erc1155: [], title: "" };
  };

  const { erc721, erc1155, title } = getDisplayData();

  const hasERC721 = erc721.length > 0;
  const hasERC1155 = erc1155.length > 0;
  const hasAnyNFT = hasERC721 || hasERC1155;

  return (
    <div className={Style.AuthorNFTCardBox}>
      {(collectiables || created) && (
        <>
          {hasAnyNFT ? (
            <div className={Style.nftSections}>
              <h2 className={Style.mainTitle}>{title}</h2>
              <div className={Style.nftSection}>
                <h3 className={Style.sectionTitle}>ERC-721 NFTs</h3>
                {hasERC721 ? (
                  <NFTCardTwo NFTData={erc721} />
                ) : (
                  <p className={Style.noNFTText}>No ERC-721 NFTs found</p>
                )}
              </div>

              <div className={Style.nftSection}>
                <h3 className={Style.sectionTitle}>ERC-1155 NFTs</h3>
                {hasERC1155 ? (
                  <NFTCard NFTData={erc1155} />
                ) : (
                  <p className={Style.noNFTText}>No ERC-1155 NFTs found</p>
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </>
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
