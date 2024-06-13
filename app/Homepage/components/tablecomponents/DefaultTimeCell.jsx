import { format, isValid } from "date-fns";
import React, { useState, useEffect, useCallback } from "react";

const DefaultTimeCell = ({ getValue, row, column, table }) => {
  const selectedValue = getValue();

  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(selectedValue);


  function isValidTimeFormat(text) {
    const timeFormatRegex = /^(0[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/i;
    if (timeFormatRegex.test(text)) {
      const [time, period] = text.split(" ");
      const [hours, minutes, seconds] = time.split(":").map(Number);
      // validate time
      if (
        hours >= 1 &&
        hours <= 12 &&
        minutes >= 0 &&
        minutes <= 59 &&
        seconds >= 0 &&
        seconds <= 59
      ) {
        return true;
      }
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
    if (focused) {
      if (isValidTimeFormat(content) || content === "") {
        setFocused(false);
        table.options.meta.updateData(row.index, column.id, content);
      } else {
        alert("Invalid Time Format");
        setFocused(false);
        setContent(selectedValue);
      }
    } else {
      alert("Invalid Date Format");
      setFocused(false);
      setContent(selectedValue);
    }
  };

  const handleKeyPress = useCallback((event) => {
    if (event.ctrlKey && event.key === ":") {
      event.preventDefault();
      const today = new Date();
      setContent(format(today, "hh:mm:ss aa"));
      
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
      className={`w-full h-full min-h-10 bg-inherit ${focused ? "focus" : ""}`}
      onClick={handleSelectCell}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onDoubleClick={() => setIsOpen(!isOpen)}
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  );
};

export default DefaultTimeCell;
