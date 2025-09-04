import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MdTimer } from "react-icons/md";
import { format } from "timeago.js";

import Style from "./SliderCard.module.css";
import images from "../../../../img";
import LikeProfile from "../../LikeProfile/LikeProfile";

const SliderCard = ({ el, i }) => {
  return (
    <motion.div className={Style.sliderCard}>
      <div className={Style.sliderCard_box}>
        <motion.div className={Style.sliderCard_box_img}>
          <video
            controls
            autoPlay
            muted
            loop
            className={Style.sliderCard_box_img_img}
          >
            <source src={el.pinataData} type={`video/${el.fileExtension}`} />
          </video>
        </motion.div>
        <div className={Style.sliderCard_box_title}>
          <p>
            {el.name} &nbsp;&nbsp; #{el.tokenId}
          </p>
        </div>

        <div className={Style.sliderCard_box_price}>
          <div className={Style.sliderCard_box_price_box}>
            <small>Current Bid</small>
            <p>{el.price} ETH</p>
          </div>

          <div className={Style.sliderCard_box_price_time}>
            <MdTimer />
            <span>{format(Number(el.createdAt), "vi")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SliderCard;
