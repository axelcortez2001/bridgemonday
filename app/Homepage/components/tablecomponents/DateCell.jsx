import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarOutline } from "react-icons/io5";
import React, { useState, forwardRef } from "react";
import { format, isValid, parse } from "date-fns";

import styles from "@/app/styles";

const DateCustomInput = forwardRef(({ value, onClick, clearDate }, ref) => (
  <div
    className='flex items-center justify-center cursor-pointer w-full gap-x-1'
    ref={ref}
    onClick={onClick}
  >
    {value ? (
      <>
        {value}

        <div
          className='text-md text-red-500 '
          onClick={(e) => {
            e.stopPropagation();
            clearDate();
          }}
        >
          &times;
        </div>
      </>
    ) : (
      <div>
        <IoCalendarOutline />
      </div>
    )}
  </div>
));

DateCustomInput.displayName = "DateCustomInput";
const DateCell = ({ getValue, row, column, table }) => {
  const date = getValue();
  const parseDate = (dateStr) => {
    // Check if the dateStr is a valid date format
    if (!dateStr || typeof dateStr !== "string") return null;
    // Check if it's a single date
    if (isValid(parse(dateStr, "dd/MM/yyyy", new Date()))) {
      const newDat = parse(dateStr, "dd/MM/yyyy", new Date());
      return format(newDat, "yyyy-MM-dd");
    }
    if (isValid(parse(dateStr, "yyyy-MM-dd", new Date()))) {
      return format(dateStr, "yyyy-MM-dd");
    }
    // Check if it's a date range
    const dateRangeRegex = /^(\d{4}-\d{2}-\d{2}) to (\d{4}-\d{2}-\d{2})$/;
    const match = dateStr.match(dateRangeRegex);
    if (match) {
      const startDate = parse(match[1], "yyyy-MM-dd", new Date());
      return format(startDate, "yyyy-MM-dd");
    }
    return null;
  };
  const handleBlur = (e) => {
    const value = e.target.value;
    handleDateChange(value);
  };
  const { updateData } = table.options.meta;
  //   const [date, setDate] = useState(parseAbsoluteToLocal(dateData));
  const handleDateChange = (date) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      updateData(row.index, column.id, formattedDate);
    } else {
      updateData(row.index, column.id, null);
    }
  };
  return (
    <div className={`${styles.flexCenter} min-w-[160px]`}>
      <DatePicker
        portalId='root-portal'
        classNames={{ calendarContent: "bg-a-black" }}
        label='Start Date'
        dateFormat='YYYY-MM-dd'
        selected={parseDate(date)}
        onChange={handleDateChange}
        customInput={
          <DateCustomInput
            clearDate={() => updateData(row.index, column.id, null)}
          />
        }
      ></DatePicker>
    </div>
  );
};

export default DateCell;
