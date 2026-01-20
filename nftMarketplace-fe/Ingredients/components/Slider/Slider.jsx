import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";

import Style from "./Slider.module.css";
import SliderCard from "./SliderCard/SliderCard";

const Slider = ({ NFTData = [] }) => {
  const [width, setWidth] = useState(0);
  const dragSlider = useRef(null);

  const videoNFTs = NFTData.filter((nft) => nft.category === "Video");

  useEffect(() => {
    if (!dragSlider.current || videoNFTs.length === 0) return;

    const scrollWidth = dragSlider.current.scrollWidth;
    const offsetWidth = dragSlider.current.offsetWidth;

    setWidth(scrollWidth - offsetWidth + 50);
  }, [videoNFTs]);

  const handleScroll = (direction) => {
    if (!dragSlider.current) return;

    const scrollAmount =
      window.innerWidth > 1800 ? 300 : window.innerWidth > 1200 ? 280 : 240;

    dragSlider.current.scrollLeft +=
      direction === "left" ? -scrollAmount : scrollAmount;
  };

  if (videoNFTs.length === 0) {
    return (
      <div className={Style.empty}>
        <div className={Style.empty_box}>
          <span className={Style.empty_icon}>🎬</span>
          <h3>Chưa có NFT video</h3>
          <p>
            Hiện tại chưa có NFT video nào để hiển thị.
            <br />
            Vui lòng thử lại sau hoặc chọn danh mục khác.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={Style.slider}>
      <div className={Style.slider_box}>
        <div className={Style.slider_box_button}>
          <div className={Style.slider_box_button_btn}>
            <div
              className={Style.slider_box_button_btn_icon}
              onClick={() => handleScroll("left")}
            >
              <TiArrowLeftThick />
            </div>
            <div
              className={Style.slider_box_button_btn_icon}
              onClick={() => handleScroll("right")}
            >
              <TiArrowRightThick />
            </div>
          </div>
        </div>

        <motion.div className={Style.slider_box_itmes} ref={dragSlider}>
          <motion.div
            className={Style.slider_box_item}
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
          >
            {videoNFTs.map((el, i) => (
              <SliderCard key={i} el={el} i={i} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Slider;
