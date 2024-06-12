import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import {
  IoIosStats,
  IoMdPeople,
  IoMdText,
  IoMdArrowDropdown,
} from "react-icons/io";
import { BsCalendar2Date } from "react-icons/bs";
import { MdNumbers } from "react-icons/md";
import { CiCalendarDate, CiTimer } from "react-icons/ci";
import { useAtom, useSetAtom } from "jotai";
import { addSubItemColumn, selectedProjectAtom } from "../../datastore";
const AddSubItemDropDown = () => {
  const [project, setProject] = useAtom(selectedProjectAtom);
  const addItem = useSetAtom(addSubItemColumn);
  const handleSelect = (projectId, itemName, itemType) => {
    addItem(projectId, itemName, itemType);
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <button variant='bordered' className='border rounded-md h-8 w-8 bg-[#32449C] text-white'>
          +
        </button>
      </DropdownTrigger>
      <DropdownMenu
        variant='flat'
        aria-label='Dropdown menu with shortcut'
        className=''
      >
        <DropdownItem
          key='status'
          textValue='Status'
          onClick={() => handleSelect(project._id, "Substatus")}
        >
          <div className='flex w-full items-center gap-x-2'>
            <div className=' bg-green-400 w-7 h-7 flex items-center justify-center border rounded-md'>
              <IoIosStats color='white' />
            </div>
            <p>Status</p>
          </div>
        </DropdownItem>
        <DropdownItem
          textValue='Text'
          key='text'
          onClick={() => handleSelect(project._id, "Subtext")}
        >
          <div className='flex w-full items-center gap-x-2'>
            <div className=' bg-blue-300 w-7 h-7 flex items-center justify-center border rounded-md'>
              <IoMdText color='white' />
            </div>
            <p>Text</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key='people'
          textValue='People'
          onClick={() => handleSelect(project._id, "Subpeople")}
        >
          <div className='flex w-full items-center gap-x-2'>
            <div className=' bg-blue-500 w-7 h-7 flex items-center justify-center border rounded-md'>
              <IoMdPeople color='white' />
            </div>
            <p>People</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key='dropdown'
          textValue='Drop Down'
          onClick={() => handleSelect(project._id, "SubDropDown")}
        >
          <div className='flex w-full items-center gap-x-2'>
            <div className=' bg-red-400 w-7 h-7 flex items-center justify-center border rounded-md'>
              <IoMdArrowDropdown color='white' />
            </div>
            <p>Drop Down</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key='date'
          textValue='Date'
          onClick={() => handleSelect(project._id, "Subdate")}
        >
          <div className='flex w-full items-center gap-x-2'>
            <div className=' bg-green-400 w-7 h-7 flex items-center justify-center border rounded-md'>
              <BsCalendar2Date color='white' />
            </div>
            <p>Date</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key='numbers'
          textValue='Numbers'
          onClick={() => handleSelect(project._id, "SubNumber")}
        >
          <div className='flex w-full items-center gap-x-2'>
            <div className=' bg-red-500 w-7 h-7 flex items-center justify-center border rounded-md'>
              <MdNumbers color='white' />
            </div>
            <p>Numbers</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key='defaultDate'
          textValue='Default Date'
          onClick={() => handleSelect(project._id, "SubDefaultDate")}
        >
          <div className='flex w-full items-center gap-x-2'>
            <div className=' bg-green-600 w-7 h-7 flex items-center justify-center border rounded-md'>
              <CiCalendarDate color='white' />
            </div>
            <p>Default Date</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key='defaultTime'
          textValue='Default Time'
          onClick={() => handleSelect(project._id, "SubDefaultTime")}
        >
          {" "}
          <div className='flex w-full items-center gap-x-2'>
            <div className=' bg-orange-500 w-7 h-7 flex items-center justify-center border rounded-md'>
              <CiTimer color='white' />
            </div>
            <p>Default Time</p>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AddSubItemDropDown;
