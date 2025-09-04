import React from "react";
import Image from "next/image";
import { MdVerified } from "react-icons/md";

import Style from "./DayComponents.module.css";
import images from "../../../../img";

const DayComponets = ({ el, i }) => {
  return (
    <div className={Style.daysComponets}>
      <div className={Style.daysComponets_box}>
        <div className={Style.daysComponets_box_img}>
          <Image
            src={el.background}
            className={Style.daysComponets_box_img_img}
            alt="profile background"
            width={500}
            height={300}
            objectFit="covers"
          />
        </div>

        <div className={Style.daysComponets_box_profile}>
          <Image
            src={el.background}
            alt="profile"
            width={200}
            height={200}
            className={Style.daysComponets_box_profile_img_1}
            objectFit="covers"
          />

          <Image
            src={el.background}
            alt="profile"
            width={200}
            height={200}
            className={Style.daysComponets_box_profile_img_2}
            objectFit="covers"
          />

          <Image
            src={el.background}
            alt="profile"
            width={200}
            height={200}
            className={Style.daysComponets_box_profile_img_3}
            objectFit="covers"
          />
        </div>

        <div className={Style.daysComponets_box_title}>
          <h2>Amazing Collection</h2>
          <div className={Style.daysComponets_box_title_info}>
            <div className={Style.daysComponets_box_title_info_profile}>
              <Image
                src={el.user}
                alt="profile"
                width={30}
                height={30}
                objectFit="covers"
                className={Style.daysComponets_box_title_info_profile_img}
              />

              <p>
                Creator
                <span>
                  Shoaib Bhai
                  <small>
                    <MdVerified />
                  </small>
                </span>
              </p>
            </div>

            <div className={Style.daysComponets_box_title_info_price}>
              <small>1.255 ETH</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayComponets;
