import React, { useState, useEffect, useCallback, useContext } from "react";
import Style from "../styles/account.module.css";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import dotenv from "dotenv";

import images from "../img";
import From from "../Ingredients/AccountPage/Form/Form";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";

dotenv.config();

const Account = () => {
  const { uploadToIPFS } = useContext(NFTMarketplaceContext);

  const [token, setToken] = useState(null);
  const [data, setData] = useState({});
  const [information, setInformation] = useState({});
  const [isImgUploading, setIsImgUploading] = useState("");
  const [background, setBackground] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/single-user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setData(response.data.user);
      setInformation(response.data.userInfo);
      setBackground(response.data.userInfo.background || "");
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const onDropAvatar = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const uploadedImageUrl = await uploadToIPFS(file);

        setIsImgUploading(uploadedImageUrl);
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    },
    [token, uploadToIPFS]
  );

  const onDropBackground = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const uploadedBgUrl = await uploadToIPFS(file);
        setBackground(uploadedBgUrl);
      } catch (error) {
        console.error("Error updating background image:", error);
      }
    },
    [token, uploadToIPFS]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropAvatar,
    accept: "image/*",
    maxSize: 5000000,
  });

  const { getRootProps: getBgRootProps, getInputProps: getBgInputProps } =
    useDropzone({
      onDrop: onDropBackground,
      accept: "image/*",
      maxSize: 5000000,
    });

  return (
    <div className={Style.account}>
      <div className={Style.account_info}>
        <h1>Profile settings</h1>
        <p>
          You can set preferred display name, create your profile URL, and
          manage other personal settings.
        </p>
      </div>

      <div className={Style.account_background} {...getBgRootProps()}>
        <input {...getBgInputProps()} />
        <Image
          src={background || images.background}
          alt="background upload"
          width={800}
          height={300}
          className={Style.account_background_img}
        />
        <p className={Style.account_background_para}>Change Background</p>
      </div>

      <div className={Style.account_box}>
        <div className={Style.account_box_img} {...getRootProps()}>
          <input {...getInputProps()} />
          <Image
            src={isImgUploading || information?.photo || images.avatar}
            alt="account upload"
            width={150}
            height={150}
            className={Style.account_box_img_img}
          />
          <p className={Style.account_box_img_para}>Change Image</p>
        </div>

        <div className={Style.account_box_from}>
          <From
            data={data}
            information={information}
            background={background}
            isImgUploading={isImgUploading}
            token={token}
          />
        </div>
      </div>
    </div>
  );
};

export default Account;
