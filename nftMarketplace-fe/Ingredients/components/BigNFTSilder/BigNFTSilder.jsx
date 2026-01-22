import React, { useState, useEffect, useCallback, useContext } from "react";
import Image from "next/image";
import { AiFillHeart, AiFillAppstore, AiOutlineAppstore } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import { TbArrowBigLeftLines, TbArrowBigRightLine } from "react-icons/tb";
import { useRouter } from "next/router";

import Style from "./BigNFTSilder.module.css";
import images from "../../../img";
import Button from "../Button/Button";

import { NFTMarketplaceContext } from "../../../Context/NFTMarketplaceContext";

const BigNFTSilder = ({ Tab }) => {
  const router = useRouter();
  const { getSliderData } = useContext(NFTMarketplaceContext);

  const [idNumber, setIdNumber] = useState(0);
  const [sliderData, setSliderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const detailPath = Tab === "721" ? "/NFT-details" : "/NFTCollection-details";

  const inc = useCallback(() => {
    setIdNumber((prev) => (prev + 1 < sliderData.length ? prev + 1 : 0));
  }, [sliderData?.length]);

  const dec = useCallback(() => {
    setIdNumber((prev) => (prev > 0 ? prev - 1 : sliderData.length - 1));
  }, [sliderData?.length]);

  useEffect(() => {
    if (sliderData?.length > 1) {
      const interval = setInterval(inc, 5000);
      return () => clearInterval(interval);
    }
  }, [sliderData?.length, inc]);

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setIsLoading(true);
        setIdNumber(0);

        const data = await getSliderData({ Tab });
        setSliderData(data || []);
      } catch (error) {
        console.error("Error fetching latest NFTs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (Tab) fetchSliderData();
  }, [Tab, getSliderData]);

  if (isLoading) {
    return (
      <div className={Style.bigNFTSlider_loading}>
        <div className={Style.bigNFTSlider_loading_spinner}></div>
        <p>Đang tải các NFT mới nhất…</p>
      </div>
    );
  }

  if (!sliderData?.length) {
    return (
      <div className={Style.bigNFTSlider_empty}>
        <p>Không có NFT nào khả dụng</p>
        <Button btnName="Explore" onClick={() => {}} />{" "}
      </div>
    );
  }

  const el = sliderData[idNumber];

  return (
    <div className={Style.bigNFTSlider}>
      <div className={Style.bigNFTSlider_box}>
        <div className={Style.bigNFTSlider_box_left}>
          <div className={Style.bigNFTSlider_box_left_content}>
            <div className={Style.bigNFTSlider_box_left_badge}>
              <span>Mới</span>
              <span>-</span>
              <span>Bộ sưu tập vừa ra mắt</span>
            </div>

            <h1>{el.name}</h1>
            <p className={Style.bigNFTSlider_box_left_description}>
              {el.description ||
                "Một vật phẩm sưu tầm kỹ thuật số độc nhất vừa được tạo ra."}
            </p>

            <div className={Style.bigNFTSlider_box_left_creator}>
              <div className={Style.bigNFTSlider_box_left_creator_profile}>
                <div
                  className={Style.bigNFTSlider_box_left_creator_profile_img}
                >
                  <Image
                    src={el.photo || images.avatar}
                    alt="creator"
                    width={60}
                    height={60}
                  />
                </div>
                <div
                  className={Style.bigNFTSlider_box_left_creator_profile_info}
                >
                  <p>Người sáng tạo</p>
                  <h4>
                    {el.userName}
                    <MdVerified
                      className={Style.bigNFTSlider_box_left_creator_verified}
                    />
                  </h4>
                </div>
              </div>

              <div className={Style.bigNFTSlider_box_left_creator_collection}>
                <div
                  className={
                    Style.bigNFTSlider_box_left_creator_collection_icon
                  }
                >
                  <AiOutlineAppstore />
                </div>
                <div
                  className={
                    Style.bigNFTSlider_box_left_creator_collection_info
                  }
                >
                  <p>Bộ sưu tập</p>
                  <h4>{el.category || "Arts"}</h4>
                </div>
              </div>
            </div>

            <div className={Style.bigNFTSlider_box_left_info}>
              <div className={Style.bigNFTSlider_box_left_info_item}>
                <small>Ngày tạo</small>
                <p>{new Date(el.createdAt).toLocaleDateString("en-US")}</p>
              </div>
              <div className={Style.bigNFTSlider_box_left_info_item}>
                <small>Lượt thích</small>
                <p>
                  {el.likes || 0} <AiFillHeart />
                </p>
              </div>
            </div>

            {/* <div className={Style.bigNFTSlider_box_left_buttons}>
              <Button
                btnName="Xem chi tiết"
                onClick={() =>
                  router.push({
                    pathname: detailPath,
                    query: el,
                  })
                }
                classStyle={Style.bigNFTSlider_btn_primary}
              />
            </div> */}

            <div className={Style.bigNFTSlider_box_left_controls}>
              <div className={Style.bigNFTSlider_box_left_navigation}>
                <button onClick={dec} className={Style.bigNFTSlider_nav_btn}>
                  <TbArrowBigLeftLines />
                </button>
                <button onClick={inc} className={Style.bigNFTSlider_nav_btn}>
                  <TbArrowBigRightLine />
                </button>
              </div>

              <div className={Style.bigNFTSlider_box_left_indicator}>
                <span className={Style.bigNFTSlider_indicator_current}>
                  {idNumber + 1}
                </span>
                <span className={Style.bigNFTSlider_indicator_total}>
                  / {sliderData.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.bigNFTSlider_box_right}>
          {" "}
          <div className={Style.bigNFTSlider_box_right_image}>
            {" "}
            {el.fileExtension === "mp4" || el.fileExtension === "webm" ? (
              <video
                controls
                autoPlay
                muted
                loop
                className={Style.bigNFTSlider_box_right_media}
              >
                {" "}
                <source
                  src={el.pinataData}
                  type={`video/${el.fileExtension}`}
                />
                Trình duyệt của bạn không hỗ trợ thẻ video.{" "}
              </video>
            ) : el.fileExtension === "mp3" ||
              el.fileExtension === "wav" ||
              el.fileExtension === "ogg" ? (
              <div className={Style.bigNFTSlider_box_right_audio_container}>
                {" "}
                <div className={Style.bigNFTSlider_box_right_audio_artwork}>
                  {" "}
                  <Image
                    src={el.photo || images.creatorbackground10}
                    alt="Audio artwork"
                    width={600}
                    height={500}
                    className={Style.bigNFTSlider_box_right_audio_img}
                  />{" "}
                  <div className={Style.bigNFTSlider_box_right_audio_player}>
                    <h3>{el.name}</h3>{" "}
                    <audio
                      controls
                      className={Style.bigNFTSlider_box_right_audio_element}
                    >
                      {" "}
                      <source
                        src={el.pinataData}
                        type={`audio/${el.fileExtension}`}
                      />
                      Trình duyệt của bạn không hỗ trợ thẻ audio.{" "}
                    </audio>{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            ) : (
              <Image
                src={el.pinataData}
                alt={el.name}
                width={600}
                height={500}
                className={Style.bigNFTSlider_box_right_img}
                priority={idNumber === 0}
              />
            )}{" "}
            <div className={Style.bigNFTSlider_box_right_like}>
              {" "}
              <AiFillHeart className={Style.bigNFTSlider_box_right_like_icon} />
              <span>{el.likes || 0}</span>{" "}
            </div>{" "}
            <div className={Style.bigNFTSlider_box_right_badge}>
              <span>#{el.tokenId}</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default BigNFTSilder;
