import React from "react";
import Image from "next/image";

import Style from "./Service.module.css";
import images from "../../../img";

const Service = () => {
  return (
    <div className={Style.service}>
      <div className={Style.service_box}>
        <div className={Style.service_box_img}>
          <Image
            src={images.service1}
            alt="Learn About NFT Marketplace"
            width={100}
            height={100}
          />
          <p className={Style.service_box_img_step}>
            <span>Step 1</span>
          </p>
          <h3>Learn About NFT Marketplace</h3>
          <p>
            Before diving into the world of NFTs, it's essential to understand
            what an NFT marketplace is. These platforms allow users to buy,
            sell, and trade digital assets like artwork, music, and virtual
            collectibles. Popular marketplaces include OpenSea, Rarible, and
            Foundation. Research how they work, the transaction fees, and the
            types of NFTs available.
          </p>
        </div>

        <div className={Style.service_box_img}>
          <Image
            src={images.service2}
            alt="Connect Wallet & Create an Account"
            width={100}
            height={100}
          />
          <p className={Style.service_box_img_step}>
            <span>Step 2</span>
          </p>
          <h3>Connect Wallet & Create an Account</h3>
          <p>
            To participate in an NFT marketplace, you need a digital wallet such
            as MetaMask, Trust Wallet, or Coinbase Wallet. These wallets store
            your cryptocurrencies and NFTs. Once your wallet is set up, connect
            it to your chosen marketplace and create an account. Ensure you have
            some cryptocurrency (like ETH for Ethereum-based marketplaces) to
            cover transaction fees.
          </p>
        </div>

        <div className={Style.service_box_img}>
          <Image
            src={images.service3}
            alt="Create & Purchase NFTs, Trade Coins"
            width={100}
            height={100}
          />
          <p className={Style.service_box_img_step}>
            <span>Step 3</span>
          </p>
          <h3>Create & Purchase NFTs, Trade Coins</h3>
          <p>
            Now that your account is ready, you can start minting your own NFTs
            by uploading digital files and setting their attributes. If you're
            looking to buy, explore various collections and place bids or
            purchase directly. Additionally, you can trade cryptocurrencies
            within the marketplace to optimize your assets and maximize
            potential profits.
          </p>
        </div>

        <div className={Style.service_box_img}>
          <Image
            src={images.service4}
            alt="Start Trading"
            width={100}
            height={100}
          />
          <p className={Style.service_box_img_step}>
            <span>Step 4</span>
          </p>
          <h3>Earn Money</h3>
          <p>
            There are multiple ways to earn from NFTs. You can sell your own
            creations, trade rare NFTs, or even participate in play-to-earn
            games that reward you with tokens. Some platforms also offer
            royalties, meaning you'll earn a percentage every time your NFT is
            resold. Keep an eye on trends and market movements to maximize
            earnings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Service;
