import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

const OptionCell = ({ getValue }) => {
  const initialValue = getValue();
  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set([initialValue])
  );

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='bordered' className='capitalize w-full'>
          {selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Single selection example'
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        <DropdownItem key='todo'>TO DO</DropdownItem>
        <DropdownItem key='pending'>Pending</DropdownItem>
        <DropdownItem key='approval'>Approval</DropdownItem>
        <DropdownItem key='done'>Done</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default OptionCell;
