import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  MdVerified,
  MdCloudUpload,
  MdOutlineReportProblem,
  MdDriveFileRenameOutline,
} from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialYoutube,
  TiSocialInstagram,
  TiSocialTwitter,
} from "react-icons/ti";
import { BsThreeDots } from "react-icons/bs";

import Style from "./AuthorProfileCard.module.css";
import images from "../../../img";
import { Button } from "../../components/componentsindex.js";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const AuthorProfileCard = ({ currentAccount, information, token, data }) => {
  const copyAddress = () => {
    const copyText = document.getElementById("myInput");

    copyText.select();
    navigator.clipboard.writeText(copyText.value);
  };

  return (
    <div className={Style.AuthorProfileCard}>
      <div className={Style.AuthorProfileCard_box}>
        <div className={Style.AuthorProfileCard_box_img}>
          <Image
            src={information?.photo ? information.photo : images.avatar}
            className={Style.AuthorProfileCard_box_img_img}
            alt="NFT IMAGES"
            width={220}
            height={220}
          />
        </div>

        <div className={Style.AuthorProfileCard_box_info}>
          <br />
          <br />
          <br />

          <h2>
            {data.name}
            {""}{" "}
            <span>
              <MdDriveFileRenameOutline />
            </span>{" "}
          </h2>

          <div className={Style.AuthorProfileCard_box_info_address}>
            <input type="text" value={currentAccount} id="myInput" />
            <FiCopy
              onClick={() => copyAddress()}
              className={Style.AuthorProfileCard_box_info_address_icon}
            />
          </div>

          <p className={Style.description}>{information.description}</p>

          <div className={Style.AuthorProfileCard_box_info_social}>
            <a href={information.facebook ? information.facebook : "#"}>
              <TiSocialFacebook />
            </a>
            <a href={information.twitter ? information.twitter : "#"}>
              <TiSocialTwitter />
            </a>
            <a href={information.instagram ? information.instagram : "#"}>
              <TiSocialInstagram />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfileCard;
