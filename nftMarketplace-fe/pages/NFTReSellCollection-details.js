import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import {
  Button,
  Category,
  Brand,
  Title,
} from "../Ingredients/components/componentsindex";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

import NFTReSellCollectiondetailsDetailPage from "../Ingredients/NFTDetailsPage/NFTReSellCollectiondetailsDetailPage";

const NFTReSellCollectiondetails = () => {
  const { curentAccount } = useContext(NFTMarketplaceContext);

  const [nft, setNft] = useState({
    balance: "",
    category: "",
    createdAt: "",
    description: "",
    pinataData: "",
    fileExtension: "",
    fileSize: "",
    isOwned: "",
    name: "",
    pinataData: "",
    tokenId: "",
    tokenURI: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setNft(router.query);
  }, [router.isReady]);

  return (
    <div>
      <NFTReSellCollectiondetailsDetailPage nft={nft} />
      {/* <Title
        heading="Browse by category"
        paragraph="Explore the NFTs in the most featured categories."
      />
      <Category /> */}
      <Brand />
    </div>
  );
};

export default NFTReSellCollectiondetails;
