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
const FunctionOption = ({ chosenFunction, setChosenFunction }) => {
  return (
    <Dropdown className=' '>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant='light'
          disableAnimation
          disableRipple
          className=' w-40 border'
        >
          {chosenFunction}
        </Button>
      </DropdownTrigger>
      <DropdownMenu variant='faded' aria-label='Chart Option'>
        <DropdownItem onClick={() => setChosenFunction("IF")}>IF</DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("SUM")}>
          SUM
        </DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("DIFFERENCE")}>
          DIFFERENCE
        </DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("PRODUCT")}>
          PRODUCT
        </DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("QUOTIENT")}>
          QUOTIENT
        </DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("AVERAGE")}>
          AVERAGE
        </DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("MAX")}>
          MAX
        </DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("MIN")}>
          MIN
        </DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("MEAN")}>
          MEAN
        </DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("MEDIAN")}>
          MEDIAN
        </DropdownItem>
        <DropdownItem onClick={() => setChosenFunction("MODE")}>
          MODE
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default FunctionOption;
