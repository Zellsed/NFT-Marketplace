import React, { useContext, useEffect, useState } from "react";

import Style from "../styles/uploadNFT.module.css";

import { Upload } from "../Ingredients/UploadNFT/uplaodNFTIndex";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const uploadNFT = () => {
  const { uploadToIPFS, createNFT } = useContext(NFTMarketplaceContext);

  return (
    <div className={Style.uploadNFT}>
      <div className={Style.uploadNFT_box}>
        <div className={Style.uploadNFT_box_heading}>
          <h1>Create New NFT</h1>
          <p>
            Create a new NFT by uploading your digital asset, setting a price,
            and adding relevant details. Share your unique creation with the
            world!
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
          <Upload uploadToIPFS={uploadToIPFS} createNFT={createNFT} />
        </div>
      </div>
    </div>
  );
};

export default uploadNFT;
