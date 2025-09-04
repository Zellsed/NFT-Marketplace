import React, { useState } from "react";

import Style from "./AudioCardSmall.module.css";

const AudioCardSmall = ({ NFTData }) => {
  return (
    <div className={Style.audioPlayer}>
      <div className={Style.audioPlayer_box}>
        <div className={Style.audioPlayer_box_info}>
          <h4>{NFTData.name}</h4>
          <h5>#{NFTData.tokenId}</h5>
          <div className={Style.audioPlayer_box_info_box}>
            <div className={Style.audioPlayer_box_info_box_price}>
              <small>Price</small>
              <p>{NFTData.price} ETH</p>
            </div>
          </div>
        </div>

        <div className={Style.audioPlayer_box_audio}>
          <div className={Style.audioContainer}>
            <audio controls className={Style.audioElement}>
              <source
                src={NFTData.pinataData}
                type={`audio/${NFTData.fileExtension}`}
              />
            </audio>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCardSmall;
