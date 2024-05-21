import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { SlOptionsVertical } from "react-icons/sl";

const HeaderOption = () => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <button className='w-6 h-6 absolute items-center top-0 -right-6 justify-center p-1 opacity-0 rounded-md hover:bg-gray-200 hover:opacity-100'>
          <SlOptionsVertical />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Action event example'
        onAction={(key) => alert(key)}
      >
        <DropdownItem key='new'>New file</DropdownItem>
        <DropdownItem key='copy'>Copy link</DropdownItem>
        <DropdownItem key='edit'>Edit file</DropdownItem>
        <DropdownItem key='delete' className='text-danger' color='danger'>
          Delete file
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default HeaderOption;
