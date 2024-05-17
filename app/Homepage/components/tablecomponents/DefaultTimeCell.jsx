import { format } from "date-fns";
import React, { useState, useEffect, useCallback } from "react";

const DefaultTimeCell = ({ getValue, row, column, table }) => {
  const selectedValue = getValue();

  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(selectedValue);

  function isValidDateFormat(text) {
    // Check if the text matches the date format "YYYY-MM-DD"
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateFormatRegex.test(text)) {
      // If the text matches the format, attempt to create a Date object
      const date = new Date(text);
      // Check if the created Date object is a valid date
      return !isNaN(date.getTime());
    }
    return false;
  }
  const handleSelectCell = () => {
    setIsOpen(!isOpen);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    !isValidDateFormat(content) && content !== ""
      ? (alert("Invalid Date Format"), setFocused(false))
      : setFocused(false);
  };

  const handleKeyPress = useCallback((event) => {
    if (event.ctrlKey && event.key === ";") {
      event.preventDefault();
      const today = new Date().toISOString().split("T")[0];
      setContent(today);
      table.options.meta.updateData(row.index, column.id, today);
    }
  }, []);

  useEffect(() => {
    if (focused) {
      document.addEventListener("keydown", handleKeyPress);
      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [focused, handleKeyPress]);

  return (
    <input
      className={`w-full h-full min-h-10 ${focused ? "focus" : ""}`}
      onClick={handleSelectCell}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onDoubleClick={() => setIsOpen(!isOpen)}
      value={content ? format(content, "yyy-MM-dd") : content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
};

export default DefaultTimeCell;
