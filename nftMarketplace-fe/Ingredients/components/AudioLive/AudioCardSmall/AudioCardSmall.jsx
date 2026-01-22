import React from "react";
import Style from "./AudioCardSmall.module.css";
import { TbMusic } from "react-icons/tb";
import Link from "next/link";

const AudioCardSmall = ({ NFTData, Tab }) => {
  const detailPath = Tab === "1155" ? "/NFTCollection-details" : "/NFT-details";

  return (
    <Link
      href={{
        pathname: detailPath,
        query: NFTData,
      }}
    >
      <div className={Style.audioSmall}>
        <div className={Style.audioSmall_box}>
          <div className={Style.audioSmall_left}>
            <div className={Style.mini_disc}>
              <TbMusic />
            </div>
            <div className={Style.audioSmall_info}>
              <h4>{NFTData.name}</h4>
              <p>{NFTData.price} ZELL</p>
            </div>
          </div>

          <div className={Style.audioSmall_right}>
            <audio controls className={Style.mini_audio}>
              <source
                src={NFTData.pinataData}
                type={`audio/${NFTData.fileExtension}`}
              />
            </audio>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AudioCardSmall;
