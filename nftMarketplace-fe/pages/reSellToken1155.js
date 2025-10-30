import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { FaEthereum } from "react-icons/fa";
import { Button } from "../Ingredients/components/componentsindex";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

import Style from "../styles/reSellToken1155.module.css";

const ReSellToken = () => {
  const { reSellToken1155 } = useContext(NFTMarketplaceContext);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileExtension, setExtension] = useState("");
  const [category, setCategory] = useState("");
  const [balance, setBalance] = useState(0);

  const router = useRouter();
  const { id, tokenURI, tokenQuantity, token } = router.query;

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
      setBalance(tokenQuantity || 0);
    } catch (err) {
      console.log("Error fetching NFT:", err);
    }
  };

  useEffect(() => {
    fetchNFT();
  }, [id]);

  const resell = async () => {
    try {
      if (!price || price <= 0) {
        alert("Please enter a valid price!");
        return;
      }

      if (!quantity || quantity <= 0 || quantity > balance) {
        alert("Invalid quantity to sell!");
        return;
      }

      await reSellToken1155(tokenURI, quantity, price, true, id);
      // router.push("/author");
    } catch (error) {
      console.log("Error while resell", error);
    }
  };

  return (
    <div className={Style.reSellToken}>
      <div className={Style.reSellToken_container}>
        <div className={Style.reSellToken_preview}>
          {fileExtension === "mp4" || fileExtension === "webm" ? (
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
              alt="NFT"
              width={500}
              height={500}
              className={Style.preview_image}
            />
          )}
        </div>

        <div className={Style.reSellToken_info}>
          <h1 className={Style.title}>Resell NFT Collection</h1>
          <h2>{name}</h2>
          <p className={Style.desc}>{description}</p>

          <div className={Style.details}>
            <p>
              <strong>Category:</strong> {category}
            </p>
            <p>
              <strong>Available:</strong> {balance}
            </p>
          </div>

          <div className={Style.quantityInput}>
            <label htmlFor="quantity">Quantity to sell</label>
            <input
              id="quantity"
              type="number"
              min={1}
              max={balance}
              value={quantity}
              placeholder="Enter quantity"
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div className={Style.priceInput}>
            <label htmlFor="price">Set Resell Price</label>
            <div className={Style.priceField}>
              <input
                id="price"
                type="number"
                min={0.001}
                placeholder="Enter price (WEB)"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <Button
            btnName="List NFT for Sale"
            classStyle={Style.resellBtn}
            onClick={resell}
          />
        </div>
      </div>
    </div>
  );
};

export default ReSellToken;
