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
            alt="Tìm hiểu về chợ giao dịch NFT"
            width={100}
            height={100}
          />
          <p className={Style.service_box_img_step}>
            <span>Bước 1</span>
          </p>
          <h3>Tìm hiểu về chợ giao dịch NFT</h3>
          <p>
            Trước khi bước vào thế giới NFT, điều quan trọng là bạn cần hiểu NFT
            Marketplace là gì. Đây là những nền tảng cho phép người dùng mua,
            bán và giao dịch các tài sản kỹ thuật số như tác phẩm nghệ thuật, âm
            nhạc và các vật phẩm sưu tầm ảo. Những marketplace phổ biến có thể
            kể đến như OpenSea, Rarible và Foundation. Hãy tìm hiểu cách chúng
            hoạt động, các loại phí giao dịch và những dạng NFT được cung cấp.
          </p>
        </div>

        <div className={Style.service_box_img}>
          <Image
            src={images.service2}
            alt="Kết nối ví & tạo tài khoản"
            width={100}
            height={100}
          />
          <p className={Style.service_box_img_step}>
            <span>Bước 2</span>
          </p>
          <h3>Kết nối ví & tạo tài khoản</h3>
          <p>
            Để tham gia vào một NFT Marketplace, bạn cần có một ví điện tử như
            MetaMask, Trust Wallet hoặc Coinbase Wallet. Những ví này dùng để
            lưu trữ tiền mã hóa và NFT của bạn. Sau khi thiết lập ví xong, hãy
            kết nối ví với marketplace mà bạn chọn và tạo tài khoản. Đảm bảo bạn
            có sẵn một lượng tiền mã hóa (ví dụ như ETH đối với các marketplace
            dựa trên Ethereum) để chi trả phí giao dịch.
          </p>
        </div>

        <div className={Style.service_box_img}>
          <Image
            src={images.service3}
            alt="Tạo & mua NFT, giao dịch coin"
            width={100}
            height={100}
          />
          <p className={Style.service_box_img_step}>
            <span>Bước 3</span>
          </p>
          <h3>Tạo & mua NFT, giao dịch coin</h3>
          <p>
            “Khi tài khoản của bạn đã sẵn sàng, bạn có thể bắt đầu mint NFT của
            riêng mình bằng cách tải lên các tệp kỹ thuật số và thiết lập các
            thuộc tính cho chúng. Nếu bạn muốn mua NFT, hãy khám phá các bộ sưu
            tập khác nhau và đặt giá thầu hoặc mua trực tiếp. Ngoài ra, bạn cũng
            có thể giao dịch tiền mã hóa ngay trên marketplace để tối ưu tài sản
            và gia tăng lợi nhuận tiềm năng.
          </p>
        </div>

        <div className={Style.service_box_img}>
          <Image
            src={images.service4}
            alt="Kiếm tiền"
            width={100}
            height={100}
          />
          <p className={Style.service_box_img_step}>
            <span>Bước 4</span>
          </p>
          <h3>Kiếm tiền</h3>
          <p>
            Có nhiều cách để kiếm tiền từ NFT. Bạn có thể bán các tác phẩm do
            chính mình tạo ra, giao dịch những NFT hiếm, hoặc tham gia các trò
            chơi play-to-earn để nhận phần thưởng là token. Một số nền tảng còn
            hỗ trợ cơ chế bản quyền (royalties), nghĩa là bạn sẽ nhận được một
            phần trăm doanh thu mỗi khi NFT của bạn được bán lại. Hãy luôn theo
            dõi xu hướng và biến động thị trường để tối đa hóa thu nhập.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Service;
