import React from "react";
import Link from "next/link";

import Style from "./Discover.module.css";

const Discover = ({ token, information }) => {
  const tokendetected = [
    { name: "Transfer Funds", link: "transferFunds" },
    { name: "Collection", link: "collection" },
    { name: "Search", link: "searchPage" },
    { name: "Author Profile", link: "author" },
    { name: "Account Setting", link: "account" },
    { name: "Upload NFT", link: "uploadNFT" },
  ];

  const noTokendetected = [
    { name: "Transfer Funds", link: "transferFunds" },
    { name: "Collection", link: "collection" },
    { name: "Search", link: "searchPage" },
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
