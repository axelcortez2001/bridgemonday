import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { CiFilter } from "react-icons/ci";
const FilterColumn = ({
  data,
  setSelectedColumn,
  selectedColumn,
  setColumnValue,
}) => {
  //get all columns for filtering
  const getAllColumns = () => {
    let columnData = [];
    if (data && data !== undefined) {
      data?.columns?.map((column) => {
        if (column.newItemName !== undefined) {
          columnData.push(column);
        }
      });
    }
    return columnData;
  };
  const handleClick = (colData) => {
    setSelectedColumn(colData.newItemName);
    setColumnValue(colData);
  };
  return (
    <Dropdown className='w-full'>
      <DropdownTrigger>
        <button className='h-full w-full  hover:bg-gray-400 flex items-center p-1 rounded-md'>
          <CiFilter /> {selectedColumn}
        </button>
      </DropdownTrigger>
      <DropdownMenu variant='faded' aria-label='Dropdown menu with icons'>
        {getAllColumns()?.map((column) => (
          <DropdownItem
            key={column.newItemName}
            onClick={() => handleClick(column)}
          >
            {column.newItemName}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FilterColumn;
