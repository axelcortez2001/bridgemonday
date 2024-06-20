import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
const FilterCondition = ({
  selectedColumn,
  condition,
  setCondition,
  columnValue,
}) => {
  const [conditionOptions, setConditionOptions] = useState([null]);
  const [selectedCondition, setSelectedCondition] = useState("");
  const getConditionOption = (colValue) => {
    switch (colValue?.key?.toLocaleLowerCase()) {
      case "status":
        return ["is", "is not"];

      case "text":
        return ["is", "is not", "contains"];
      default:
        return [null];
    }
  };
  const handleClick = (e) => {
    setCondition(e);
    setSelectedCondition(e);
  };
  useEffect(() => {
    const conditionStatus = getConditionOption(columnValue);
    setConditionOptions(conditionStatus);
    if (conditionStatus !== null) {
      setSelectedCondition(conditionStatus[0]);
      setCondition(conditionStatus[0]);
    }
    {
    }
  }, [columnValue]);
  return (
    <div className='w-full'>
      {" "}
      <Dropdown className='w-full'>
        <DropdownTrigger>
          <button className='h-full w-full  hover:bg-gray-400 flex items-center p-1 rounded-md'>
            {conditionOptions === null ? condition : selectedCondition}
          </button>
        </DropdownTrigger>
        <DropdownMenu variant='faded' aria-label='Dropdown menu with icons'>
          {conditionOptions !== null &&
            conditionOptions?.map((column) => (
              <DropdownItem key={column} onClick={() => handleClick(column)}>
                {column}
              </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default FilterCondition;
