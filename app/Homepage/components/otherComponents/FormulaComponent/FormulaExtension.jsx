import React, { useState } from "react";
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
const FormulaExtension = ({ extension, setExtension, setFullExtension }) => {
  const [valueOpen, setValueOpen] = useState(false);
  const [val, setVal] = useState("");

  return (
    <div className='w-full flex'>
      <div className='flex flex-row '>
        <Dropdown className=''>
          <DropdownTrigger>
            <Button
              isIconOnly
              variant='light'
              disableAnimation
              disableRipple
              className='w-5 border'
            >
              +
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant='faded' aria-label='Chart Option'>
            <DropdownItem textValue='==' onClick={() => setExtension("==")}>
              {"=="}
            </DropdownItem>
            <DropdownItem textValue='>' onClick={() => setExtension(">")}>
              {">"}
            </DropdownItem>
            <DropdownItem textValue='<' onClick={() => setExtension("<")}>
              {"<"}
            </DropdownItem>
            <DropdownItem textValue='>=' onClick={() => setExtension(">=")}>
              {">="}
            </DropdownItem>
            <DropdownItem textValue='<=' onClick={() => setExtension("<=")}>
              {"<="}
            </DropdownItem>
            <DropdownItem textValue='!=' onClick={() => setExtension("!=")}>
              {"!="}
            </DropdownItem>
            <DropdownItem textValue='&&' onClick={() => setExtension("&&")}>
              {"AND"}
            </DropdownItem>
            <DropdownItem textValue='||' onClick={() => setExtension("||")}>
              {"OR"}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Input
        value={extension}
        onChange={(e) => setFullExtension(e.target.value)}
        className='w-full'
      />
    </div>
  );
};

export default FormulaExtension;
