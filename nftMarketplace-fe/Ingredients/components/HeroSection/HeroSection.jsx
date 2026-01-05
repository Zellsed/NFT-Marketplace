import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Style from "./HeroSection.module.css";
import images from "../../../img";

import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const HeroSection = () => {
  const router = useRouter();
  const { titleData } = useContext(NFTMarketplaceContext);

  return (
    <div className={Style.heroSection}>
      <div className={Style.heroSection_box}>
        <div className={Style.heroSection_box_left}>
          <h1>{titleData} 🖼️</h1>
          <p>
            Khám phá những NFT nổi bật nhất trong mọi lĩnh vực của cuộc sống.
            Sáng tạo NFT của riêng bạn và bán chúng.
          </p>
          <button
            className={Style.heroSection_box_button}
            onClick={() => router.push("/searchPage")}
          >
            Bắt đầu tìm kiếm
          </button>
        </div>
        <div className={Style.heroSection_box_right}>
          <Image
            src={images.hero}
            alt="Hero section"
            width={750}
            height={700}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
