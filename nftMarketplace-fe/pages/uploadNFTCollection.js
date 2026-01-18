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
          <h1>Tạo bộ sưu tập NFT mới</h1>
          <p>
            Tạo một bộ sưu tập NFT mới bằng cách tải lên tài sản số của bạn,
            thiết lập giá và thêm các thông tin liên quan. Hãy chia sẻ tác phẩm
            độc đáo của bạn với toàn thế giới!
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
