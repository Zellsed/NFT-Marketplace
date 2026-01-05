import React, { useState, useEffect } from "react";
import Link from "next/link";

import Style from "./HelpCenter.module.css";

const HelpCenter = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setAccessToken(token);
  }, []);

  const helpCenter = [
    {
      name: "Đăng ký",
      link: "signUp",
    },
    {
      name: "Đăng nhập",
      link: "login",
    },
    {
      name: "Liên hệ",
      link: "contactus",
    },
    {
      name: "Giới thiệu",
      link: "aboutus",
    },
  ];

  const fiteredHelpCenter = helpCenter.filter((item) => {
    if (accessToken && (item.link === "signUp" || item.link === "login")) {
      return false;
    }
    return true;
  });

  return (
    <div className={Style.box}>
      {fiteredHelpCenter.map((el, i) => (
        <div key={i + 1} className={Style.helpCenter}>
          <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
        </div>
      ))}
    </div>
  );
};

export default HelpCenter;
