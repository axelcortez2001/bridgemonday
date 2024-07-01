import React from "react";
import {
  Input,
  Skeleton,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
const ColumnSelected = ({ columnData, chosenColumn, setChosenColumn }) => {
  return (
    <Dropdown className=''>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant='light'
          disableAnimation
          disableRipple
          className='w-60'
        >
          {chosenColumn === null ? "Select Column" : chosenColumn.newItemName}
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant='faded' aria-label='Chart Option'>
        {columnData &&
          columnData.length > 0 &&
          columnData.map((column, index) => (
            <DropdownItem key={index} onClick={() => setChosenColumn(column)}>
              {column.newItemName}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ColumnSelected;
