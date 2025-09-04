import React from "react";
import Image from "next/image";
import { DiJqueryLogo } from "react-icons/di";
import { useRouter } from "next/router";

import Style from "./Brand.module.css";
import images from "../../../img";

const Brand = () => {
  const router = useRouter();

  return (
    <div className={Style.Brand}>
      <div className={Style.Brand_box}>
        <div className={Style.Brand_box_left}>
          <h1>Earn free crypto with Ciscrypt</h1>
          <br />
          <p className={Style.description}>
            Discover the easiest way to earn free cryptocurrency with Ciscrypt!
            Join our innovative platform and start earning crypto rewards by
            completing simple tasks, participating in exciting campaigns, and
            referring friends. Whether you're a crypto enthusiast or just
            getting started, Ciscrypt offers a seamless and secure experience to
            grow your digital assets effortlessly. Don't miss out on this
            opportunity to dive into the world of crypto—sign up today and start
            earning for free! 🚀💰
          </p>

          {/* <div className={Style.Brand_box_left_btn}>
            <button
              className={Style.Brand_button}
              onClick={() => router.push("/uploadNFT")}
            >
              Create
            </button>

            <button
              className={Style.Brand_button}
              onClick={() => router.push("/searchPage")}
            >
              Discover
            </button>
          </div> */}
        </div>
        <div className={Style.Brand_box_right}>
          <Image src={images.earn} alt="brand logo" width={800} height={600} />
        </div>
      </div>
    </div>
  );
};

export default Brand;
