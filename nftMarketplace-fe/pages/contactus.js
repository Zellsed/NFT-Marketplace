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
          Contact
        </h1>
        <div className={Style.contactus_box_box}>
          <div className={Style.contactus_box_box_left}>
            <div className={Style.contactus_box_box_left_item}>
              <p>
                The Contact section allows users to connect with the owner or
                support team. It typically includes an email, phone number,
                contact form, social media links, and sometimes a location map
                for inquiries, feedback, or support requests.
              </p>
            </div>
            <div className={Style.contactus_box_box_left_item}>
              <h3>📧 EMAIL</h3>
              <p>zellsed123@gmail.com</p>
            </div>
            <div className={Style.contactus_box_box_left_item}>
              <h3>☎️ PHONE</h3>
              <p>096-906-8386</p>
            </div>
            {/* <div className={Style.contactus_box_box_left_item}>
              <h3>🌍 SOCIALS</h3>
              <a href="#">
                <TiSocialFacebook />
              </a>
              <a href="#">
                <TiSocialInstagram />
              </a>
              <a href="#">
                <TiSocialLinkedin />
              </a>
              <a href="#">
                <TiSocialYoutube />
              </a>
              <a href="#">
                <TiSocialTwitter />
              </a>
            </div> */}
          </div>
          <div className={Style.contactus_box_box_right}>
            <form>
              <div className={formStyle.Form_box_input}>
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  placeholder="name*"
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
                <label htmlFor="description">Message</label>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="6"
                  placeholder="Describe the data you want to send*"
                ></textarea>
              </div>
              <Button
                btnName="Send Message"
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
