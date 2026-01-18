import React from "react";

import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiContacts,
} from "react-icons/ti";

import { HiOutlineMail } from "react-icons/hi";

import Style from "../styles/contactus.module.css";
import formStyle from "../Ingredients/AccountPage/Form/Form.module.css";
import { Button } from "../Ingredients/components/componentsindex";

const contactus = () => {
  return (
    <div className={Style.contactus}>
      <div className={Style.contactus_box}>
        <h1>
          <TiContacts />
          Liên hệ
        </h1>
        <div className={Style.contactus_box_box}>
          <div className={Style.contactus_box_box_left}>
            <div className={Style.contactus_box_box_left_item}>
              <p>
                Mục Liên hệ cho phép người dùng kết nối với chủ sở hữu hoặc đội
                ngũ hỗ trợ. Phần này thường bao gồm email, số điện thoại, biểu
                mẫu liên hệ, các liên kết mạng xã hội và đôi khi là bản đồ vị
                trí để gửi câu hỏi, phản hồi hoặc yêu cầu hỗ trợ.
              </p>
            </div>
            <div className={Style.contactus_box_box_left_item}>
              <h3>📧 EMAIL</h3>
              <p>zellsed123@gmail.com</p>
            </div>
            <div className={Style.contactus_box_box_left_item}>
              <h3>☎️ SỐ ĐIỆN THOẠI</h3>
              <p>096-906-8386</p>
            </div>
          </div>
          <div className={Style.contactus_box_box_right}>
            <form>
              <div className={formStyle.Form_box_input}>
                <label htmlFor="name">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Tên người dùng*"
                  className={formStyle.Form_box_input_userName}
                />
              </div>

              <div className={formStyle.Form_box_input}>
                <label htmlFor="email">Email</label>
                <div className={formStyle.Form_box_input_box}>
                  <div className={formStyle.Form_box_input_box_icon}>
                    <HiOutlineMail />
                  </div>
                  <input type="text" placeholder="nc.example@example.com*" />
                </div>
              </div>

              <div className={formStyle.Form_box_input}>
                <label htmlFor="description">Tin nhắn</label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="6"
                  placeholder="Mô tả dữ liệu bạn muốn gửi*"
                ></textarea>
              </div>
              <Button
                btnName="Gửi tin nhắn"
                onClick={() => {}}
                classStyle={Style.button}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default contactus;
