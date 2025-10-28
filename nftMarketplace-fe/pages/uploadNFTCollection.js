import React, { useContext, useEffect, useState } from "react";

import Style from "../styles/uploadNFT.module.css";

import { UploadNFT1155 } from "../Ingredients/UploadNFT/uplaodNFTIndex";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const uploadNFTCollection = () => {
  const { uploadToIPFS, createNFT1155 } = useContext(NFTMarketplaceContext);

  return (
    <div className={Style.uploadNFT}>
      <div className={Style.uploadNFT_box}>
        <div className={Style.uploadNFT_box_heading}>
          <h1>Create New NFT Collection</h1>
          <p>
            Create a new NFT collection by uploading your digital asset, setting
            a price, and adding relevant details. Share your unique creation
            with the world!
          </p>
        </div>

        <div className={Style.uploadNFT_box_title}>
          <h2>Image, Video, Audio, or 3D Model</h2>
          <p>
            File types supported: JPG, PNG, GIF, SVG, MP4, WEBM ,MP3, WAV, OGG,
            GLTF.
          </p>
        </div>

        <div className={Style.uploadNFT_box_form}>
          <UploadNFT1155
            uploadToIPFS={uploadToIPFS}
            createNFT1155={createNFT1155}
          />
        </div>
      </div>
    </div>
  );
};

export default uploadNFTCollection;
