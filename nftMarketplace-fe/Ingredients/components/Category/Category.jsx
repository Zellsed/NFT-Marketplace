import React, { useState, useEffect } from "react";
import Image from "next/image";
import { BsCircleFill } from "react-icons/bs";
import { FaBitcoin } from "react-icons/fa";

import Style from "./Category.module.css";
import images from "../../../img";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const Category = () => {
  const [categories, setCategories] = useState([]);

  const fetchNftCategory = async () => {
    try {
      const category = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/nft-marketplace/category-nft`
      );

      setCategories(category.data);
    } catch (error) {
      console.error("Error fetching nft category:", error);
    }
  };

  useEffect(() => {
    fetchNftCategory();
  }, []);

  const CategoryArray = [
    images.creatorbackground1,
    images.creatorbackground2,
    images.creatorbackground3,
    images.creatorbackground4,
    images.creatorbackground5,
    images.creatorbackground6,
    images.creatorbackground7,
    images.creatorbackground8,
    images.creatorbackground9,
    images.creatorbackground10,
    images.creatorbackground11,
  ];

  return (
    <div className={Style.box_category}>
      <div className={Style.category}>
        {categories.map((el, i) => (
          <div className={Style.category_box} key={1 + 1}>
            {el.category === "Sports" && (
              <div>
                <Image
                  src={images.sports}
                  className={Style.category_box_img}
                  alt="Sports Category"
                  width={350}
                  height={150}
                  objectFit="cover"
                />
                <div className={Style.category_box_title}>
                  <span>
                    <FaBitcoin />
                  </span>
                  <div className={Style.category_box_title_info}>
                    <h4>{el.category}</h4>
                    <small>{el.count} NFTS</small>
                  </div>
                </div>
              </div>
            )}

            {el.category === "Arts" && (
              <div>
                <Image
                  src={images.art}
                  className={Style.category_box_img}
                  alt="Arts Category"
                  width={350}
                  height={150}
                  objectFit="cover"
                />
                <div className={Style.category_box_title}>
                  <span>
                    <FaBitcoin />
                  </span>
                  <div className={Style.category_box_title_info}>
                    <h4>{el.category}</h4>
                    <small>{el.count} NFTS</small>
                  </div>
                </div>
              </div>
            )}

            {el.category === "Music" && (
              <div>
                <Image
                  src={images.music}
                  className={Style.category_box_img}
                  alt="Music Category"
                  width={350}
                  height={150}
                  objectFit="cover"
                />
                <div className={Style.category_box_title}>
                  <span>
                    <FaBitcoin />
                  </span>
                  <div className={Style.category_box_title_info}>
                    <h4>{el.category}</h4>
                    <small>{el.count} NFTS</small>
                  </div>
                </div>
              </div>
            )}

            {el.category === "Video" && (
              <div>
                <Image
                  src={images.video}
                  className={Style.category_box_img}
                  alt="Video Category"
                  width={350}
                  height={150}
                  objectFit="cover"
                />
                <div className={Style.category_box_title}>
                  <span>
                    <FaBitcoin />
                  </span>
                  <div className={Style.category_box_title_info}>
                    <h4>{el.category}</h4>
                    <small>{el.count} NFTS</small>
                  </div>
                </div>
              </div>
            )}

            {el.category === "Photography" && (
              <div>
                <Image
                  src={images.photography}
                  className={Style.category_box_img}
                  alt="Photography Category"
                  width={350}
                  height={150}
                  objectFit="cover"
                />
                <div className={Style.category_box_title}>
                  <span>
                    <FaBitcoin />
                  </span>
                  <div className={Style.category_box_title_info}>
                    <h4>{el.category}</h4>
                    <small>{el.count} NFTS</small>
                  </div>
                </div>
              </div>
            )}

            {el.category === "VirtualWorlds" && (
              <div>
                <Image
                  src={images.virtualWorld}
                  className={Style.category_box_img}
                  alt="Vitual Worlds Category"
                  width={350}
                  height={150}
                  objectFit="cover"
                />
                <div className={Style.category_box_title}>
                  <span>
                    <FaBitcoin />
                  </span>
                  <div className={Style.category_box_title_info}>
                    <h4>{el.category}</h4>
                    <small>{el.count} NFTS</small>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
