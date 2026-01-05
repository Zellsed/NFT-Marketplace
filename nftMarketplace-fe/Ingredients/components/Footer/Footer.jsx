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
            Chợ giao dịch kỹ thuật số đầu tiên dành cho các bộ sưu tập crypto và
            token không thể thay thế (NFT). Mua, bán và khám phá những vật phẩm
            kỹ thuật số độc quyền.
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
          <h3>Khám phá</h3>
          <Discover />
        </div>

        <div className={Style.footer_box_help}>
          <h3>Trung tâm trợ giúp</h3>
          <HelpCenter />
        </div>

        <div className={Style.subscribe}>
          <h3>
            Khám phá, sưu tầm và mua bán những NFT độc đáo. NFT Marketplace là
            chợ giao dịch NFT đầu tiên.
          </h3>

          <div className={Style.subscribe_box_img}>
            <p>
              NFT Marketplace là chợ giao dịch NFT đầu tiên, nơi các nghệ sĩ,
              nhà sáng tạo và nhà sưu tầm hội tụ để giao dịch những tài sản kỹ
              thuật số độc nhất một cách an toàn và liền mạch. Dù bạn là nhà
              giao dịch giàu kinh nghiệm hay người mới bước chân vào thế giới
              blockchain, OpenSea đều cung cấp một nền tảng trực quan giúp bạn
              khám phá một vũ trụ rộng lớn gồm các vật phẩm sưu tầm kỹ thuật số,
              tác phẩm nghệ thuật, vật phẩm trong game và tài sản ảo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
