import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import Style from "./Filter.module.css";

const categories = [
  "Arts",
  "Music",
  "Video",
  "Photography",
  "Games",
  "VirtualWorlds",
];

const Filter = ({ onSelectCategory }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <div className={Style.filter}>
      <div className={Style.filter_box}>
        {isOpen && (
          <div className={Style.filter_box_left}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => handleSelect(cat)}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className={Style.filter_box_right}>
          <div
            className={Style.filter_box_right_box}
            onClick={() => setIsOpen((p) => !p)}
          >
            <FaFilter />
            <span>{isOpen ? "Đóng" : "Lọc"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
