import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";

import {
  Button,
  Category,
  Brand,
  Title,
} from "../Ingredients/components/componentsindex";
import NFTDetailsPage from "../Ingredients/NFTDetailsPage/NFTDetailsPage";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const NFTdetails = () => {
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
      <NFTDetailsPage nft={nft} />
      <Title
        heading="Browse by category"
        paragraph="Explore the NFTs in the most featured categories."
      />
      <Category />
      <Brand />
    </div>
  );
};

export default NFTdetails;
