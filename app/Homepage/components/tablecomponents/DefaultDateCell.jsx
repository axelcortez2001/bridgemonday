import { select } from "@nextui-org/theme";
import { format } from "date-fns";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const DefaultDateCell = ({ getValue, row, column, table }) => {
  const selectedValue = getValue();

  const [focused, setFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(
    selectedValue ? format(selectedValue, "yyyy-MM-dd") : selectedValue
  );

  function isValidDateFormat(text) {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateFormatRegex.test(text)) {
      const date = new Date(text);
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
    if (focused) {
      if (isValidDateFormat(content) || content === "") {
        setFocused(false);
        table.options.meta.updateData(row.index, column.id, content);
      } else {
        toast("Invalid Date Format");
        setFocused(false);
        setContent(
          selectedValue ? format(selectedValue, "yyyy-MM-dd") : selectedValue
        );
      }
    }
  };

  const handleKeyPress = useCallback((event) => {
    if (event.ctrlKey && event.key === ";") {
      event.preventDefault();
      const today = new Date().toISOString().split("T")[0];
      // const today = new Date().toLocaleTimeString("en-AU", {
      //   hour: "2-digit",
      //   minute: "2-digit",
      //   second: "2-digit",
      // });
      setContent(today);
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

export default DefaultDateCell;
