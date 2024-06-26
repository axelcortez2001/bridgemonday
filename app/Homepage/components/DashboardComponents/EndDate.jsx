import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarOutline } from "react-icons/io5";
import { format } from "date-fns";

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
const EndDate = ({ endDate, setEndDate }) => {
  const handleDateChange = (endDate) => {
    if (endDate) {
      const formattedDate = format(endDate, "yyyy-MM-dd");
      setEndDate(formattedDate);
    } 
  };
  return (
    <div className={`${styles.flexCenter} min-w-[160px]`}>
      <DatePicker
        popperClassName='date-picker-reports'
        classNames={{ calendarContent: "bg-a-black" }}
        label='Start Date'
        dateFormat='YYYY-MM-dd'
        selected={endDate}
        onChange={handleDateChange}
        customInput={<DateCustomInput clearDate={() => setEndDate(null)} />}
      ></DatePicker>
    </div>
  );
};

export default EndDate;
