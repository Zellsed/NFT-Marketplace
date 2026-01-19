import React, { useState } from "react";
import Image from "next/image";
import { TiArrowSortedDown, TiArrowSortedUp, TiTick } from "react-icons/ti";

import Style from "./AuthorTap.module.css";

const AuthorTaps = ({ setCollectiables, setCreated }) => {
  const [openList, setOpenList] = useState(false);
  const [activeBtn, setActiveBtn] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState("Most Recent");

  const openTab = (e) => {
    const btnText = e.target.innerText;
    if (btnText == "NFT được niêm yết") {
      setCollectiables(true);
      setCreated(false);
      setActiveBtn(1);
    } else if (btnText == "NFT sở hữu") {
      setCollectiables(false);
      setCreated(true);
      setActiveBtn(2);
    }
  };

  return (
    <div className={Style.AuthorTaps}>
      <div className={Style.AuthorTaps_box}>
        <div className={Style.AuthorTaps_box_left}>
          <div className={Style.AuthorTaps_box_left_btn}>
            <button
              className={`${activeBtn == 1 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              NFT được niêm yết
            </button>
            <button
              className={`${activeBtn == 2 ? Style.active : ""}`}
              onClick={(e) => openTab(e)}
            >
              NFT sở hữu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorTaps;
