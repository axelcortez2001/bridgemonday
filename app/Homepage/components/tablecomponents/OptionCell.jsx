import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { statusesData } from "../../datastore";

const OptionCell = ({ getValue, row, column, table }) => {
  const { text, color } = getValue() || {};
  const { updateData } = table.options.meta;

  //provided by nextui template
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([text]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  console.log("SelectedKeys", color);
  const checkColor = (color) => {
    if (!color.startsWith("bg-")) {
      return `bg-${color}`;
    }
    return color;
  };
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant='bordered'
          className={`capitalize w-full ${checkColor(color)}`}
        >
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
        {statusesData.map((status) => (
          <DropdownItem
            key={status.text}
            onClick={() => updateData(row.index, column.id, status)}
            className={`${status.color} text-white `}
          >
            {status.text}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default OptionCell;
