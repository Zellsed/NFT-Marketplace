import React from "react";
import Image from "next/image";

import Style from "../styles/aboutus.module.css";
import { Brand } from "../Ingredients/components/componentsindex";
import images from "../img";

const aboutus = () => {
  const founderArray = [
    {
      name: "Huy Quach",
      position: "Blockchain Developer",
      images: images.zellsed,
    },
  ];

  return (
    <div className={Style.aboutus}>
      <div className={Style.aboutus_box}>
        <div className={Style.aboutus_box_hero}>
          <div className={Style.aboutus_box_hero_left}>
            <h1>👋 Giới thiệu.</h1>
            <p>
              Tôi tự hào vì luôn giữ lập trường công bằng và độc lập, đảm bảo
              rằng mọi nội dung tôi tạo ra đều phản ánh những giá trị này. Mỗi
              ngày, tôi dành trọn tâm huyết để sản xuất các chương trình và tài
              liệu độc đáo, đẳng cấp thế giới, không chỉ cung cấp thông tin và
              kiến thức mà còn truyền cảm hứng và giải trí cho hàng triệu người
              trên khắp thế giới. Mục tiêu của tôi là mang đến những nội dung
              chất lượng cao, ý nghĩa, gây tiếng vang với đa dạng khán giả, làm
              phong phú thêm kiến thức và trải nghiệm của họ theo cách cuốn hút
              và kích thích tư duy.
            </p>
          </div>
          <div className={Style.aboutus_box_hero_right}>
            <Image src={images.hero2} />
          </div>
        </div>

        <div className={Style.aboutus_box_title}>
          <h2>⛱️ Người sáng lập.</h2>
          <p>
            Tôi duy trì sự công bằng và độc lập, tạo ra các chương trình đẳng
            cấp thế giới, vừa cung cấp thông tin, vừa giáo dục, đồng thời giải
            trí cho hàng triệu người trên toàn cầu. Cam kết về chất lượng và sự
            liêm chính, tôi khơi dậy sự tò mò, thúc đẩy các cuộc thảo luận, và
            mang đến những nội dung có tác động sâu sắc, dễ tiếp cận.
          </p>
        </div>

        <div className={Style.aboutus_box_founder}>
          <div className={Style.aboutus_box_founder_box}>
            <div className={Style.aboutus_box_founder_box_img}>
              <Image
                src={images.zellsed}
                alt={"Huy Quach"}
                width={500}
                height={500}
                className={Style.aboutus_box_founder_box_img_img}
              />
              <h3>{"Huy Quach"}</h3>
              <p>{"Blockchain Developer"}</p>
            </div>
          </div>
        </div>
      </div>
      <Brand />
    </div>
  );
};

export default aboutus;
