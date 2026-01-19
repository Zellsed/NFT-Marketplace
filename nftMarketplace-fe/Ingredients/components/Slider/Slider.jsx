import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TiArrowLeftThick, TiArrowRightThick } from "react-icons/ti";

import Style from "./Slider.module.css";
import SliderCard from "./SliderCard/SliderCard";
import images from "../../../img";

const Slider = ({ NFTData }) => {
  const [width, setWidth] = useState(0);
  const dragSlider = useRef();

  useEffect(() => {
    setWidth(
      dragSlider.current.scrollWidth - dragSlider.current.offsetWidth + 50,
    );
  }, [NFTData]);

  const handleScroll = (direction) => {
    const { current } = dragSlider;
    const scrollAmount =
      window.innerWidth > 1800 ? 300 : window.innerWidth > 1200 ? 280 : 240;

    if (direction == "left") {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  return (
    <div className={Style.slider}>
      <div className={Style.slider_box}>
        <h2>Khám phá NFT Video</h2>
        <div className={Style.slider_box_button}>
          <p>Nhấn vào biểu tượng phát và thưởng thức các NFT video.</p>
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
            ref={dragSlider}
            className={Style.slider_box_item}
            drag="x"
            dragConstraints={{ right: 0, left: -width }}
          >
            {NFTData?.filter((nft) => nft.category === "Video").map((el, i) => (
              <SliderCard key={i + 1} el={el} i={i} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Slider;
