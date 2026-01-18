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

const UploadNFT1155 = ({ uploadToIPFS, createNFT1155 }) => {
  const [price, setPrice] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
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
      image: images.game,
      category: "Games",
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
        heading="Kéo & thả tệp"
        subHeading="hoặc duyệt tệp đa phương tiện trên thiết bị của bạn"
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
          <label htmlFor="nft">Tên vật phẩm</label>
          <input
            type="text"
            placeholder="NFT Collection Name"
            className={formStyle.Form_box_input_userName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="description">Mô tả</label>
          <textarea
            name=""
            id=""
            cols="30"
            rows="6"
            placeholder="something about yourself NFT collection in few words"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <p>
            Phần mô tả sẽ được hiển thị trên trang chi tiết của vật phẩm, bên
            dưới hình ảnh của nó.
          </p>
        </div>

        <div className={formStyle.Form_box_input}>
          <label htmlFor="name">Choose collection</label>
          <p className={Style.upload_box_input_para}>
            Chọn một danh mục cho bộ sưu tập NFT của bạn
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
                <p>Loại danh mục - {el.category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={formStyle.Form_box_input_social}>
          <div className={formStyle.Form_box_input}>
            <label htmlFor="price">Total Supply</label>
            <div className={formStyle.Form_box_input_box}>
              <div className={formStyle.Form_box_input_box_icon}>
                <AiTwotonePropertySafety />
              </div>
              <input
                type="text"
                placeholder="Total Supply of NFT Collection"
                onChange={(e) => setTotalSupply(e.target.value)}
              />
            </div>
          </div>
        </div>
        <p>
          Vui lòng chỉ định tổng số NFT bạn muốn mint trong bộ sưu tập này. Điều
          này sẽ quyết định có bao nhiêu token sẽ được phát hành để mua.
        </p>

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
          Vui lòng nhập giá cho bộ sưu tập NFT của bạn. Đây sẽ là số tiền người
          mua phải trả để sở hữu tài sản số của bạn.
        </p>

        <div className={Style.upload_box_btn}>
          <Button
            btnName="Tải lên"
            onClick={async () => {
              const createdAt = Date.now();
              createNFT1155(
                name,
                price,
                totalSupply,
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
            btnName="Xem trước"
            onClick={() => setShowPreview(true)}
            classStyle={Style.upload_box_btn_style}
          />

          {showPreview && (
            <div className={Style.preview_modal}>
              <div
                className={Style.preview_overlay}
                onClick={() => setShowPreview(false)}
              />
              <div className={Style.preview_content}>
                <h2>Xem trước bộ sưu tập NFT</h2>

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
                    <p>Chưa chọn phương tiện</p>
                  )}
                </div>

                <div className={Style.details}>
                  <div className={Style.detail_item}>
                    <strong>Tên:</strong>
                    <span>{name || "N/A"}</span>
                  </div>
                  <div className={Style.detail_item}>
                    <strong>Mô tả:</strong>
                    <span>{description || "N/A"}</span>
                  </div>
                  <div className={Style.detail_item}>
                    <strong>Tổng cung:</strong>
                    <span>{totalSupply || "0"}</span>
                  </div>
                  <div className={Style.detail_item}>
                    <strong>Giá:</strong>
                    <span>{price || "0"} ZELL</span>
                  </div>
                  <div className={Style.detail_item}>
                    <strong>Danh mục:</strong>
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

export default UploadNFT1155;
