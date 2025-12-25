import { useState } from "react";

const Etext = ({ text = "", limit = 100, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Make sure text is always a string
  const safeText = typeof text === "string" ? text : "";

  const isLong = safeText.length > limit;
  const visibleText = isExpanded
    ? safeText
    : safeText.slice(0, limit) + (isLong ? "..." : "");

  return (
    <div className={className}>
      <p>{visibleText}</p>

      {isLong && (
        <button className="expand"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "green",
            textDecoration: "underline",
            fontSize: "inherit",
            fontFamily: "inherit",
          }}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default Etext;
