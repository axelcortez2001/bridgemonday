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
const StartDate = ({ startDate, setStartDate }) => {
  const handleDateChange = (startDate) => {
    if (startDate) {
      const formattedDate = format(startDate, "yyyy-MM-dd");
      setStartDate(formattedDate);;
    } 
  };
  return (
    <div className={`${styles.flexCenter} min-w-[160px]`}>
      <DatePicker
        popperClassName='date-picker-reports'
        classNames={{ calendarContent: "bg-a-black" }}
        label='Start Date'
        dateFormat='YYYY-MM-dd'
        selected={startDate}
        onChange={handleDateChange}
        customInput={<DateCustomInput clearDate={() => setStartDate(null)} />}
      ></DatePicker>
    </div>
  );
};

export default StartDate;
