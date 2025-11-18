import React from "react";

const TokenAmount = ({ amount, symbol = "WEB", className = "" }) => {
  const formatAmount = (value) => {
    if (value === null || value === undefined) return "0";

    try {
      let num;

      if (typeof value === "string" && value.includes(".")) {
        num = parseFloat(value);
      } else if (Number(value) > 1e15) {
        num = Number(BigInt(value)) / 1e18;
      } else {
        num = Number(value);
      }

      if (isNaN(num) || !isFinite(num)) return "0";

      const absNum = Math.abs(num);

      if (absNum >= 1e12) {
        const formatted = (num / 1e12).toFixed(2);
        return formatted.endsWith(".00")
          ? formatted.slice(0, -3) + "T"
          : formatted + "T";
      } else if (absNum >= 1e9) {
        const formatted = (num / 1e9).toFixed(2);
        return formatted.endsWith(".00")
          ? formatted.slice(0, -3) + "B"
          : formatted + "B";
      } else if (absNum >= 1e6) {
        const formatted = (num / 1e6).toFixed(2);
        return formatted.endsWith(".00")
          ? formatted.slice(0, -3) + "M"
          : formatted + "M";
      } else {
        return num.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      }
    } catch (error) {
      console.error("Error formatting token amount:", error);
      return String(value);
    }
  };

  return (
    <span className={className}>
      {formatAmount(amount)} {symbol}
    </span>
  );
};

export const formatRawValue = (value) => {
  if (value === null || value === undefined) return "0";

  try {
    let num;

    if (typeof value === "string" && value.includes(".")) {
      num = parseFloat(value);
    } else if (Number(value) > 1e15) {
      num = Number(BigInt(value)) / 1e18;
    } else {
      num = Number(value);
    }

    if (isNaN(num) || !isFinite(num)) return "0";

    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error("Error formatting raw value:", error);
    return String(value);
  }
};

export default TokenAmount;
