import React, { useState, forwardRef } from "react";
import StartDate from "./StartDate";
import EndDate from "./EndDate";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import {
  format,
  addDays,
  previousMonday,
  nextSunday,
  addWeeks,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";
const FilterDate = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  filterState,
  setFilterState,
}) => {
  const dateToday = new Date();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleFilterState = (text) => {
    const formattedDate = format(dateToday, "yyyy-MM-dd");
    if (text === "Today") {
      setFilterState(text);
      setStartDate(formattedDate);
      setEndDate(formattedDate);
    } else if (text === "Tomorrow") {
      const tom = addDays(formattedDate, 1);
      setFilterState(text);
      setStartDate(tom);
      setEndDate(tom);
    } else if (text === "Yesterday") {
      const yesterday = addDays(formattedDate, -1);
      console.log("Yesterday: ", yesterday);
      setFilterState(text);
      setStartDate(yesterday);
      setEndDate(yesterday);
    } else if (text === "This Week") {
      const startWeek = previousMonday(formattedDate);
      const endWeek = nextSunday(formattedDate);
      console.log("Started ", startWeek, " ", endWeek);
      setFilterState(text);
      setStartDate(startWeek);
      setEndDate(endWeek);
    } else if (text === "Last Week") {
      const dateLastWeek = addWeeks(formattedDate, -1);
      const startWeek = previousMonday(dateLastWeek);
      const endWeek = nextSunday(dateLastWeek);
      console.log("Started ", startWeek, " ", endWeek);
      setFilterState(text);
      setStartDate(startWeek);
      setEndDate(endWeek);
    } else if (text === "Next Week") {
      const dateNextWeek = addWeeks(formattedDate, 1);
      const startWeek = previousMonday(dateNextWeek);
      const endWeek = nextSunday(dateNextWeek);
      console.log("Started ", startWeek, " ", endWeek);
      setFilterState(text);
      setStartDate(startWeek);
      setEndDate(endWeek);
    } else if (text === "This Month") {
      const startMonth = startOfMonth(formattedDate);
      const endMonth = endOfMonth(formattedDate);
      console.log("Started ", startMonth, " ", endMonth);
      setFilterState(text);
      setStartDate(startMonth);
      setEndDate(endMonth);
    } else if (text === "Last Month") {
      const dateLastMonth = addMonths(formattedDate, -1);
      const startMonth = startOfMonth(dateLastMonth);
      const endMonth = endOfMonth(dateLastMonth);
      console.log("Started ", startMonth, " ", endMonth);
      setFilterState(text);
      setStartDate(startMonth);
      setEndDate(endMonth);
    } else if (text === "Next Month") {
      const dateNextMonth = addMonths(formattedDate, 1);
      const startMonth = startOfMonth(dateNextMonth);
      const endMonth = endOfMonth(dateNextMonth);
      console.log("Started ", startMonth, " ", endMonth);
      setFilterState(text);
      setStartDate(startMonth);
      setEndDate(endMonth);
    } else if (text === "None") {
      setFilterState(text);
      setStartDate("");
      setEndDate("");
    } else {
      setFilterState(text);
      setStartDate("");
      setEndDate("");
    }
  };
  return (
    <div>
      Filter Date
      <div>
        {" "}
        <Dropdown className='w-full overflow-y-auto'>
          <DropdownTrigger>
            <Button
              isIconOnly
              size='sm'
              variant='light'
              disableAnimation
              disableRipple
              className='w-full'
            >
              {filterState}
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant='faded' aria-label='Chart Option'>
            <DropdownItem onClick={() => handleFilterState("None")}>
              None
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterState("Today")}>
              Today
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterState("Tomorrow")}>
              Tomorrow
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterState("Yesterday")}>
              Yesterday
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterState("This Week")}>
              This Week
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterState("Last Week")}>
              Last Week
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterState("Next Week")}>
              Next Week
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterState("This Month")}>
              This Month
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterState("Last Month")}>
              Last Month
            </DropdownItem>
            <DropdownItem onClick={() => handleFilterState("Next Month")}>
              Next Month
            </DropdownItem>
            <DropdownItem onClick={() => setFilterState("Custom")}>
              Custom
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      {filterState === "Custom" && (
        <div className='flex flex-row'>
          <div>
            Start Date
            <StartDate startDate={startDate} setStartDate={setStartDate} />
          </div>
          <div>
            End Date
            <EndDate endDate={endDate} setEndDate={setEndDate} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDate;
