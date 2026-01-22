import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { FaEthereum } from "react-icons/fa";
import { Button } from "../Ingredients/components/componentsindex";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

import Style from "../styles/reSellToken1155.module.css";

const ReSellToken = () => {
  const { createSale } = useContext(NFTMarketplaceContext);

  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileExtension, setExtension] = useState("");
  const [category, setCategory] = useState("");

  const router = useRouter();
  const { id, tokenURI, token } = router.query;

  const fetchNFT = async () => {
    if (!tokenURI) return;

    try {
      const { data } = await axios.get(tokenURI);
      const metadata = typeof data === "string" ? JSON.parse(data) : data;

      setImage(metadata.pinataData);
      setName(metadata.name);
      setDescription(metadata.description);
      setExtension(metadata.fileExtension);
      setCategory(metadata.category);
    } catch (error) {
      console.log("Error fetching NFT:", error);
    }
  };

  useEffect(() => {
    if (router.isReady) fetchNFT();
  }, [router.isReady, id]);

  const resell = async () => {
    try {
      await createSale(tokenURI, price, true, id);

      router.push("/searchPage");
    } catch (error) {
      console.log("Error while resell:", error);
    }
  };

  return (
    <div className={Style.reSellToken}>
      <div className={Style.reSellToken_container}>
        <div className={Style.reSellToken_preview}>
          {image ? (
            fileExtension === "mp4" || fileExtension === "webm" ? (
              <video controls className={Style.preview_media}>
                <source src={image} type={`video/${fileExtension}`} />
              </video>
            ) : fileExtension === "mp3" ||
              fileExtension === "wav" ||
              fileExtension === "ogg" ? (
              <audio controls className={Style.preview_audio}>
                <source src={image} type={`audio/${fileExtension}`} />
              </audio>
            ) : (
              <Image
                src={image}
                alt="NFT Preview"
                width={500}
                height={500}
                className={Style.preview_image}
              />
            )
          ) : (
            <p>Đang tải bản xem trước NFT...</p>
          )}
        </div>

        <div className={Style.reSellToken_info}>
          <h1 className={Style.title}>Bán NFT của bạn</h1>
          {name && <h2>{name}</h2>}
          {description && <p className={Style.desc}>{description}</p>}

          <div className={Style.details}>
            {category && (
              <p>
                <strong>Loại:</strong> {category}
              </p>
            )}
          </div>

          <div className={Style.priceInput}>
            <label htmlFor="price">Đặt giá bán lại</label>
            <div className={Style.priceField}>
              <input
                id="price"
                type="number"
                min={0.001}
                step="0.001"
                placeholder="Nhập giá (WEB)"
                onChange={(e) => setPrice(e.target.value)}
              />
              <FaEthereum className={Style.ethIcon} />
            </div>
          </div>

          <Button
            btnName="Đăng bán"
            classStyle={Style.resellBtn}
            onClick={resell}
          />
        </div>
      </div>
    </div>
  );
};

export default ReSellToken;
