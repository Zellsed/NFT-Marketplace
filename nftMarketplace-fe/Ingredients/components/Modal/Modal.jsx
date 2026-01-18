import React, { useEffect, useState } from "react";
import Style from "./Modal.module.css";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const Modal = ({ isOpen, onClose, userTransactions }) => {
  const [transactions, setTransactions] = useState([]);

  const { id } = userTransactions[0] || {};

  useEffect(() => {
    if (!id) return;

    const getAllTransactionsUserId = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/all-transaction/${id}`
        );
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    getAllTransactionsUserId();
  }, [id]);

  if (!isOpen) return null;

  return (
    <div className={Style.overlay} onClick={onClose}>
      <div className={Style.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Chi tiết giao dịch</h2>
        <table>
          <thead>
            <tr>
              <th>Mã người dùng</th>
              <th>Đã chi</th>
              <th>Loại chi tiêu</th>
              <th>Thời gian tạo</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{id}</td>
                <td>{tx.spent}</td>
                <td>{tx.spentType}</td>
                <td>
                  {new Date(tx.createdAt).toLocaleString("vi-VN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default Modal;
