import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoCalendarOutline } from "react-icons/io5";
import React, { useState, forwardRef } from "react";
import {
  parseAbsoluteToLocal,
  getLocalTimeZone,
} from "@internationalized/date";
import styles from "@/app/styles";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

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

  return (
    <div className={`${styles.flexCenter} min-w-[160px]`}>
      <DatePicker
        portalId="root-portal"
        classNames={{ calendarContent: "bg-a-black" }}
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
