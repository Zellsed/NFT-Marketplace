import React from "react";
import Link from "next/link";

import Style from "./Discover.module.css";

const Discover = ({ token, information }) => {
  const tokendetected = [
    { name: "Chuyển tiền", link: "transferFunds" },
    { name: "Tìm kiếm", link: "searchPage" },
    { name: "Trang cá nhân tác giả", link: "author" },
    { name: "Cài đặt tài khoản", link: "account" },
    { name: "Đăng NFT", link: "uploadNFT" },
  ];

  const noTokendetected = [
    { name: "Chuyển tiền", link: "transferFunds" },
    { name: "Tìm kiếm", link: "searchPage" },
  ];

  return (
    <div>
      {(!token ? noTokendetected : tokendetected).map((el, i) => (
        <div key={i + 1} className={Style.discover}>
          <Link href={`/${el.link}`}>{el.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default Discover;
