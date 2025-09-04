import React, { useEffect, useState } from "react";

import Style from "./Upload.module.css";
import { MdOutlineHttp, MdOutlineAttachFile } from "react-icons/md";
import { FaPercent } from "react-icons/fa";
import { AiTwotonePropertySafety } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import Image from "next/image";

import formStyle from "../AccountPage/Form/Form.module.css";
import images from "../../img";
import { Button } from "../components/componentsindex";
import { DropZone } from "../UploadNFT/uplaodNFTIndex";
import { useRouter } from "next/router";

const Upload = ({ uploadToIPFS, createNFT }) => {
  const [price, setPrice] = useState("");
  const [active, setActive] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(0);
  const [image, setImage] = useState(null);
  const [fileExtension, setFileExtension] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  const [showPreview, setShowPreview] = useState(false);
  const [token, setToken] = useState(null);

  const router = useRouter();

  const categoryArry = [
    {
      image: images.sports,
      category: "Sports",
    },
    {
      image: images.art,
      category: "Arts",
    },
    {
      image: images.music,
      category: "Music",
    },
    {
      image: images.video,
      category: "Video",
    },
    {
      image: images.photography,
      category: "Photography",
    },
    {
      image: images.virtualWorld,
      category: "VirtualWorlds",
    },
  ];

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    const checkTokenValidity = () => {
      const savedToken = localStorage.getItem("access_token");
      const expiresAt = localStorage.getItem("expires_at");

      if (savedToken && expiresAt) {
        if (Date.now() > Number(expiresAt)) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("expires_at");
          setToken(null);
        } else {
          setToken(savedToken);
        }
      }
    };

    checkTokenValidity();

    const interval = setInterval(checkTokenValidity, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={Style.upload}>
      <DropZone
        title="JPG, PNG, GIF, SVG, MP4, WEBM ,MP3, WAV, OGG,
            GLTF."
        heading="Drag & frop file"
        subHeading="or Browse media on your device"
        name={name}
        description={description}
        category={category}
        setImage={setImage}
        setFileExtension={setFileExtension}
        setFileSize={setFileSize}
        uploadToIPFS={uploadToIPFS}
      />

      <div className={Style.upload_box}>
        <div className={formStyle.Form_box_input}>
          <label htmlFor="nft">Item Name</label>
          <input
            type="text"
            placeholder="NFT Name"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="description">Description</label>
          <textarea
            name=""
            id=""
            cols="30"
            rows="6"
            placeholder="something about yourself NFT in few words"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p>
            The description will be included on the item's detail page
            underneath its image. Markdown syntax is supported.
          </p>
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="name">Choose collection</label>
          <p className={Style.upload_box_input_para}>
            Choose an exiting collection or create a new one
          </p>

          <div className={Style.upload_box_slider_div}>
            {categoryArry.map((el, i) => (
              <div
                className={`${Style.upload_box_slider} ${
                  active == i + 1 ? Style.active : ""
                }`}
                key={i + 1}
                onClick={() => (setActive(i + 1), setCategory(el.category))}
              >
                <div className={Style.upload_box_slider_box}>
                  <div className={Style.upload_box_slider_box_img}>
                    <Image
                      src={el.image}
                      alt="background image"
                      width={70}
                      height={70}
                      className={Style.upload_box_slider_box_img_img}
                    />
                  </div>
                  <div className={Style.upload_box_slider_box_img_icon}>
                    <TiTick />
                  </div>
                </div>
                <p>Crypto Legend - {el.category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={formStyle.Form_box_input_social}>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="price">Price</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="text"
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        </div>
        <p>
          Please enter the price for your NFT. This will be the amount buyers
          must pay to purchase your digital asset.
        </p>

        <div className={Style.upload_box_btn}>
          <Button
            btnName="Upload"
            onClick={async () => {
              const createdAt = Date.now();
              createNFT(
                name,
                price,
                image,
                description,
                router,
                category,
                fileExtension,
                fileSize,
                createdAt,
                token
              );
            }}
            classStyle={Style.upload_box_btn_style}
          />
          <Button
            btnName="Preview"
            onClick={() => setShowPreview(true)}
            classStyle={Style.upload_box_btn_style}
          />
          {/* {showPreview && (
            <div className={Style.preview_modal}>
              <div className={Style.preview_content}>
                <h2>Preview NFT</h2>
                {image ? (
                  fileExtension === "mp4" || fileExtension === "webm" ? (
                    <video controls autoPlay muted loop>
                      <source src={image} type={`video/${fileExtension}`} />
                    </video>
                  ) : fileExtension === "mp3" ||
                    fileExtension === "wav" ||
                    fileExtension === "ogg" ? (
                    <audio
                      controls
                      style={{ display: "block", margin: "auto" }}
                    >
                      <source src={image} type={`audio/${fileExtension}`} />
                    </audio>
                  ) : (
                    <Image
                      src={image}
                      alt="nft image"
                      width={450}
                      height={450}
                      type={`image/${fileExtension}`}
                    />
                  )
                ) : (
                  <p>No Media Selected</p>
                )}

                <p>
                  <strong>Name:</strong> {name || ""}
                </p>
                <p>
                  <strong>Description:</strong> {description || ""}
                </p>
                <p>
                  <strong>Price:</strong> {price || ""} ETH
                </p>
                <p>
                  <strong>Category:</strong> {category || ""}
                </p>

                <Button
                  btnName="Close"
                  onClick={() => setShowPreview(false)}
                  classStyle={Style.upload_box_btn_style}
                />
              </div>
            </div>
          )} */}

          {showPreview && (
            <div className={Style.preview_modal}>
              <div
                className={Style.preview_overlay}
                onClick={() => setShowPreview(false)}
              />
              <div className={Style.preview_content}>
                <h2>Preview NFT</h2>

                <div className={Style.media_wrapper}>
                  {image ? (
                    fileExtension === "mp4" || fileExtension === "webm" ? (
                      <video controls autoPlay muted loop>
                        <source src={image} type={`video/${fileExtension}`} />
                      </video>
                    ) : fileExtension === "mp3" ||
                      fileExtension === "wav" ||
                      fileExtension === "ogg" ? (
                      <audio controls>
                        <source src={image} type={`audio/${fileExtension}`} />
                      </audio>
                    ) : (
                      <Image
                        src={image}
                        alt="nft image"
                        width={400}
                        height={400}
                        className={Style.image_preview}
                      />
                    )
                  ) : (
                    <p>No Media Selected</p>
                  )}
                </div>

                <div className={Style.details}>
                  <div className={Style.detail_item}>
                    <strong>Name:</strong>
                    <span>{name || "N/A"}</span>
                  </div>
                  <div className={Style.detail_item}>
                    <strong>Description:</strong>
                    <span>{description || "N/A"}</span>
                  </div>
                  <div className={Style.detail_item}>
                    <strong>Price:</strong>
                    <span>{price || "0"} ETH</span>
                  </div>
                  <div className={Style.detail_item}>
                    <strong>Category:</strong>
                    <span>{category || "N/A"}</span>
                  </div>
                </div>
                <br />

                <Button
                  btnName="Close"
                  onClick={() => setShowPreview(false)}
                  classStyle={Style.upload_box_btn_style}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
