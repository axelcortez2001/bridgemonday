import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
const Equations = ({
  columnData,
  columnArray,
  setColumnArray,
  chosenFunction,
}) => {

  return (
    <div className='w-full flex'>
      <Dropdown className=''>
        <DropdownTrigger>
          <Button
            isIconOnly
            variant='light'
            disableAnimation
            disableRipple
            className='w-5'
          >
            <MdKeyboardArrowDown />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant='faded' aria-label='Chart Option'>
          {columnData &&
            columnData.length > 0 &&
            columnData.map((column, index) => (
              <DropdownItem key={index} onClick={() => setColumnArray(column)}>
                {column.newItemName}
              </DropdownItem>
            ))}
        </DropdownMenu>
      </Dropdown>

      {columnArray && columnArray.length > 0 && (
        <div className=' flex flex-wrap gap-2'>
          {columnArray.map((column, index) => (
            <div
              key={index}
              className='p-1 border flex items-center justify-center rounded-md text-a-blue border-a-blue'
            >
              {column.newItemName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Equations;
