import React, { useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

const FilterValue = ({ data, columnValue, value, setValue }) => {
  //function for color coding in status

  return (
    <>
      <div className='w-full flex flex-wrap  p-1'>
        {value &&
          value.length > 0 &&
          value.map((val, index) => (
            <div
              key={index}
              className={`border rounded-md p-1 text-white ${val.color}`}
            >
              {val.text}
            </div>
          ))}
        <Dropdown className='w-full'>
          <DropdownTrigger>
            <button className='capitalize border rounded-full w-7 h-7'>
              +
            </button>
          </DropdownTrigger>
          <DropdownMenu
            variant='flat'
            aria-label='Selection example'
            closeOnSelect={false}
            className='w-full flex flex-wrap '
          >
            {data?.defaultStatus.map((status) => (
              <DropdownItem
                key={status.text}
                textValue={status.text}
                onClick={() => setValue(status)}
              >
                <div className='flex justify-start items-center'>
                  <div
                    className={`${status.color} w-[24px] h-[24px] rounded`}
                  ></div>
                  <p className='pl-[12px]'>{status.text}</p>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};

export default FilterValue;
