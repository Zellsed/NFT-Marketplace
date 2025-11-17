const TokenAmount = ({ amount, symbol = "WEB", className = "" }) => {
  const formatAmount = (value) => {
    if (!value) return "0";

    try {
      let num;

      if (typeof value === "string" && value.includes(".")) {
        num = parseFloat(value);
      } else {
        const weiValue = BigInt(value);
        num = Number(weiValue) / 1e18;
      }

      if (isNaN(num) || !isFinite(num)) {
        return "0";
      }

      const absNum = Math.abs(num);

      // Sắp xếp theo thứ tự từ lớn đến nhỏ
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
      } else if (absNum >= 1e3) {
        const formatted = (num / 1e3).toFixed(2);
        return formatted.endsWith(".00")
          ? formatted.slice(0, -3) + "K"
          : formatted + "K";
      } else if (absNum >= 10) {
        return num.toFixed(1).endsWith(".0")
          ? Math.round(num).toString()
          : num.toFixed(1);
      } else if (absNum >= 1) {
        return num.toFixed(2).endsWith(".00")
          ? Math.round(num).toString()
          : num.toFixed(2);
      } else if (absNum >= 0.01) {
        return num.toFixed(3);
      } else if (absNum > 0) {
        return "< 0.01";
      } else {
        return "0";
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
  if (!value) return "0";

  try {
    let num;

    if (typeof value === "string" && value.includes(".")) {
      num = parseFloat(value);
    } else {
      const weiValue = BigInt(value);
      num = Number(weiValue) / 1e18;
    }

    if (isNaN(num) || !isFinite(num)) {
      return "0";
    }

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
