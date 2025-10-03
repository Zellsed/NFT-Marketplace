import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import Style from "./DropZone.module.css";
import images from "../../../img";

const DropZone = ({
  title,
  heading,
  subHeading,
  name,
  description,
  category,
  uploadToIPFS,
  setImage,
  setFileExtension,
  setFileSize,
}) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [fileEx, setFileEx] = useState(null);
  const [fileSz, setFileSz] = useState(null);

  const onDrop = useCallback(async (acceptedFile) => {
    const file = await acceptedFile[0];
    const fileExtension = file?.name.split(".").pop().toLowerCase();
    const fileSize = (file?.size / (1024 * 1024)).toFixed(2);

    const url = await uploadToIPFS(acceptedFile[0]);

    setFileSz(fileSize);

    setFileEx(fileExtension);

    setFileUrl(url);

    setImage(url);

    setFileExtension(fileExtension);

    setFileSize(fileSize);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*, video/*, audio/*",
    maxSize: 50000000,
  });

  return (
    <div className={Style.DropZone}>
      <div className={Style.DropZone_box} {...getRootProps()}>
        <input {...getInputProps()} />
        <div className={Style.DropZone_box_input}>
          <p>{title}</p>
          <div className={Style.DropZone_box_input_img}>
            <Image
              src={images.upload}
              alt="upload"
              width={100}
              height={100}
              objectFit="contain"
              className={Style.DropZone_box_input_img_img}
            />
          </div>

          <p>{heading}</p>
          <p>{subHeading}</p>
        </div>
      </div>

      {fileUrl && (
        <aside className={Style.DropZone_box_aside}>
          <div className={Style.DropZone_box_aside_box}>
            {fileEx === "mp4" || fileEx === "webm" ? (
              <video controls autoPlay muted loop width={200} height={200}>
                <source src={fileUrl} type={`video/${fileEx}`} />
              </video>
            ) : fileEx === "mp3" || fileEx === "wav" || fileEx === "ogg" ? (
              <audio
                controls
                style={{ display: "block", margin: "auto" }}
                className={Style.DropZone_box_aside_box_NFT_audio_element}
              >
                <source src={fileUrl} type={`audio/${fileEx}`} />
              </audio>
            ) : (
              <Image
                src={fileUrl}
                alt="nft image"
                width={200}
                height={200}
                type={`image/${fileEx}`}
              />
            )}

            <div className={Style.DropZone_box_aside_box_preview}>
              <div className={Style.DropZone_box_aside_box_preview_one}>
                <p>
                  <small>NFT Name:&nbsp;&nbsp;&nbsp;</small>
                  {name || ""}
                </p>
              </div>

              <div className={Style.DropZone_box_aside_box_preview_two}>
                <p>
                  <span>Description:&nbsp;&nbsp;&nbsp;</span>
                  {description || ""}
                </p>
              </div>

              <div className={Style.DropZone_box_aside_box_preview_three}>
                <p>
                  <span>FileSize:&nbsp;&nbsp;&nbsp;</span>
                  {fileSz || 0} MB
                </p>

                <p>
                  <span>Category:&nbsp;&nbsp;&nbsp;</span>
                  {category || ""}
                </p>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default DropZone;
