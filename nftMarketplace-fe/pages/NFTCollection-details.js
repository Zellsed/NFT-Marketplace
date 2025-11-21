import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import {
  Button,
  Category,
  Brand,
  Title,
} from "../Ingredients/components/componentsindex";
import NFTCollectionDetailsPage from "../Ingredients/NFTDetailsPage/NFTCollectionDetailsPage";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const NFTCollectiondetails = () => {
  const { curentAccount } = useContext(NFTMarketplaceContext);

  const [nft, setNft] = useState({
    price: "",
    tokenId: "",
    seller: "",
    owner: "",
    pinataData: "",
    name: "",
    description: "",
    category: "",
    fileExtension: "",
    fileSize: "",
    createdAt: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;
    setNft(router.query);
  }, [router.isReady]);

  return (
    <div>
      <NFTCollectionDetailsPage nft={nft} nft721={false} nft1155={true} />
      {/* <Title
        heading="Browse by category"
        paragraph="Explore the NFTs in the most featured categories."
      />
      <Category /> */}
      <Brand />
    </div>
  );
};

export default NFTCollectiondetails;
