import React from "react";
import Image from "next/image";

import Style from "../styles/aboutus.module.css";
import { Brand } from "../Ingredients/components/componentsindex";
import images from "../img";

const aboutus = () => {
  const founderArray = [
    {
      name: "Huy Quach",
      position: "Blockchain Developer",
      images: images.zellsed,
    },
  ];

  return (
    <div className={Style.aboutus}>
      <div className={Style.aboutus_box}>
        <div className={Style.aboutus_box_hero}>
          <div className={Style.aboutus_box_hero_left}>
            <h1>👋 About Us.</h1>
            <p>
              I take pride in being impartial and independent, ensuring that
              every piece of content I create reflects these values. Each day, I
              dedicate myself to producing distinctive, world-class programs and
              materials that not only inform and educate but also inspire and
              entertain millions of people across the globe. My goal is to
              deliver high-quality, meaningful content that resonates with
              diverse audiences, enriching their knowledge and experiences in an
              engaging and thought-provoking way.
            </p>
          </div>
          <div className={Style.aboutus_box_hero_right}>
            <Image src={images.hero2} />
          </div>
        </div>

        <div className={Style.aboutus_box_title}>
          <h2>⛱️ Founder</h2>
          <p>
            We're impartial and independent, creating world-class programmes
            that inform, educate, and entertain millions worldwide. Committed to
            quality and integrity, we inspire curiosity, spark discussions, and
            deliver impactful, accessible content.
          </p>
        </div>

        <div className={Style.aboutus_box_founder}>
          <div className={Style.aboutus_box_founder_box}>
            <div className={Style.aboutus_box_founder_box_img}>
              <Image
                src={images.zellsed}
                alt={"Huy Quach"}
                width={500}
                height={500}
                className={Style.aboutus_box_founder_box_img_img}
              />
              <h3>{"Huy Quach"}</h3>
              <p>{"Blockchain Developer"}</p>
            </div>
          </div>
        </div>
      </div>
      <Brand />
    </div>
  );
};

export default aboutus;
