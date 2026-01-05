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
          <h1>Kiếm tiền mã hóa miễn phí cùng Zell</h1>
          <br />
          <p className={Style.description}>
            Khám phá cách dễ dàng nhất để kiếm tiền mã hóa miễn phí cùng Zell!
            Tham gia nền tảng sáng tạo của chúng tôi và bắt đầu nhận thưởng
            crypto bằng cách hoàn thành các nhiệm vụ đơn giản, tham gia những
            chiến dịch hấp dẫn và giới thiệu bạn bè. Dù bạn là người đam mê tiền
            mã hóa hay chỉ mới bắt đầu, Ciscrypt mang đến trải nghiệm liền mạch
            và an toàn để bạn phát triển tài sản số một cách effortless. Đừng bỏ
            lỡ cơ hội bước vào thế giới crypto — đăng ký ngay hôm nay và bắt đầu
            kiếm tiền miễn phí! 🚀💰
          </p>
        </div>
        <div className={Style.Brand_box_right}>
          <Image src={images.earn} alt="brand logo" width={800} height={600} />
        </div>
      </div>
    </div>
  );
};

export default Brand;
