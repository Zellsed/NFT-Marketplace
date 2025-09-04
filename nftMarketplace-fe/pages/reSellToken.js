import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";

import Style from "../styles/reSellToken.module.css";
import formStyle from "../Ingredients/AccountPage/Form/Form.module.css";
import { Button } from "../Ingredients/components/componentsindex";

import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

const reSellToken = () => {
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

    const { data } = await axios.get(tokenURI);

    setImage(data.pinataData);
    setName(data.name);
    setDescription(data.description);
    setExtension(data.fileExtension);
    setCategory(data.category);
  };

  useEffect(() => {
    fetchNFT();
  }, [id]);

  const resell = async () => {
    try {
      const { transaction, tokenId } = await createSale(
        tokenURI,
        price,
        true,
        id
      );

      if (transaction) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/resell-nft`,
          {
            tokenId: tokenId,
            owner: transaction.to,
            seller: transaction.from,
            price: price,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      router.push("/author");
    } catch (error) {
      console.log("Error while resell", error);
    }
  };

  return (
    <div className={Style.reSellToken}>
      <div className={Style.reSellToken_box}>
        <h1>ReSell Your Token, Set Price</h1>

        <div className={Style.reSellToken_box_image}>
          <div className={Style.reSellToken_container}>
            <div className={Style.reSellToken_box_imageContainer}>
              {image &&
                (fileExtension === "mp4" || fileExtension === "webm" ? (
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    className={Style.NFTCardTwo_box_NFT_video}
                  >
                    <source src={image} type={`video/${fileExtension}`} />
                  </video>
                ) : fileExtension === "mp3" ||
                  fileExtension === "wav" ||
                  fileExtension === "ogg" ? (
                  <div className={Style.audioContainer}>
                    <audio
                      controls
                      className={Style.NFTCardTwo_box_NFT_audio_element}
                    >
                      <source src={image} type={`audio/${fileExtension}`} />
                    </audio>
                  </div>
                ) : (
                  <Image
                    src={image}
                    className={Style.NFTCardTwo_box_NFT_img}
                    alt="NFT image"
                    width={800}
                    height={800}
                    objectFit="cover"
                  />
                ))}
            </div>

            <div className={Style.reSellToken_box_infoWrapper}>
              <div className={Style.reSellToken_box_infoContainer}>
                {name && <h2>{name}</h2>}
                {description && <p>{description}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="name">Price</label>
          <input
            type="number"
            min={1}
            placeholder="reSell price"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className={Style.reSellToken_box_btn}>
          <Button btnName="ReSell NFT" onClick={() => resell()} />
        </div>
      </div>
    </div>
  );
};

export default reSellToken;
