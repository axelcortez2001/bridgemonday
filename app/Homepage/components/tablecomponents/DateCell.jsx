import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarOutline } from "react-icons/io5";
import React, { useState, forwardRef } from "react";
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
const DateCell = ({ getValue, row, column, table }) => {
  const date = getValue();
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
        selected={date}
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
