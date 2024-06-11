import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarOutline } from "react-icons/io5";
import React, { useState, forwardRef } from "react";
import {
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";

const DateCustomInput = forwardRef(({ value, onClick, clearDate }, ref) => (
  <div
    className="flex items-center justify-center cursor-pointer w-full gap-x-1"
    ref={ref}
    onClick={onClick}
  >
    {value ? (
      <>
        {value}
        <div
          className="text-md text-red-500 "
          onClick={(e) => {
            e.stopPropagation();
            clearDate();
          }}
        >
          &times;
        </div>
      </>
    ) : (
      <div className="w-full flex justify-center items-center">
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

  return (
    <div className="w-full flex items-center justify-center">
      <DatePicker
        className="w-full flex items-center justify-center"
        label="Start Date"
        dateFormat="MMM d YYYY"
        selected={date}
        onChange={(date) => updateData(row.index, column.id, date)}
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
