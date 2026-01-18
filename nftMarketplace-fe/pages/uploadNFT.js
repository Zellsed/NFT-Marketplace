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
          <h1>Tạo NFT mới</h1>
          <p>
            Tạo NFT mới bằng cách tải lên tài sản số của bạn, thiết lập giá bán
            và thêm các thông tin liên quan. Chia sẻ tác phẩm độc đáo của bạn
            với mọi người trên toàn thế giới!
          </p>
        </div>

        <div className={Style.uploadNFT_box_title}>
          <h2>Hình ảnh, video, âm thanh hoặc mô hình 3D</h2>
          <p>
            Các định dạng tệp được hỗ trợ: JPG, PNG, GIF, SVG, MP4, WEBM, MP3,
            WAV, OGG, GLTF.
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
