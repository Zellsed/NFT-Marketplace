import React from "react";
import Image from "next/image";
import {
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialInstagram,
  TiSocialLinkedin,
  TiSocialYoutube,
  TiArrowSortedDown,
  TiArrowSortedUp,
} from "react-icons/ti";
import { RiSendPlaneFill } from "react-icons/ri";
import { DiJqueryLogo } from "react-icons/di";

import Style from "./Footer.module.css";
import images from "../../../img";
import { Discover, HelpCenter } from "../NavBar/index";

const Footer = () => {
  return (
    <div className={Style.footer}>
      <div className={Style.footer_box}>
        <div className={Style.footer_box_social}>
          <a href="/">
            <DiJqueryLogo className={Style.footer_box_social_logo} />
          </a>
          <p>
            The world's first and largest digital marketplace for crypto
            collections and non-fungible tokens (NFTs). Buy, sell, and discover
            exclusive digital items.
          </p>

          <div className={Style.footer_social}>
            <a href="https://www.facebook.com/yk.zed">
              <TiSocialFacebook />
            </a>
            <a href="#">
              <TiSocialLinkedin />
            </a>
            <a href="#">
              <TiSocialTwitter />
            </a>
            <a href="#">
              <TiSocialYoutube />
            </a>
            <a href="#">
              <TiSocialInstagram />
            </a>
          </div>
        </div>

        <div className={Style.footer_box_discover}>
          <h3>Discover</h3>
          <Discover />
        </div>

        <div className={Style.footer_box_help}>
          <h3>Help Center</h3>
          <HelpCenter />
        </div>

        <div className={Style.subscribe}>
          <h3>
            Discover, collect, and sell extraordinary NFTs NFT Marketplace is
            the world first and lorgest NFT marketplace.
          </h3>

          <div className={Style.subscribe_box_img}>
            <p>
              NFT Marketplace is the world’s first and largest NFT marketplace,
              where artists, creators, and collectors converge to trade unique
              digital assets securely and seamlessly. Whether you're a seasoned
              trader or a newcomer to the world of blockchain, OpenSea provides
              an intuitive platform to explore a vast universe of digital
              collectibles, art, gaming items, and virtual assets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
