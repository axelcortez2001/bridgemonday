import React, { useState, forwardRef } from "react";
import StartDate from "./StartDate";
import EndDate from "./EndDate";

const FilterDate = ({
  chart,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) => {
  return (
    <div>
      Filter Date
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
    </div>
  );
};

export default FilterDate;
