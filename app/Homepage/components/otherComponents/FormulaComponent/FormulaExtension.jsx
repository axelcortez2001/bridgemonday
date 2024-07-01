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
  const handleValue = (val) => {
    if (typeof val === "number") {
      console.log("Value is a number");
    } else if (typeof val === "string") {
      console.log("Value is a string");
    }
    setExtension(`"${val}"`);
    setVal("");
  };

  return (
    <div className='w-full'>
      <Input
        value={extension}
        onChange={(e) => setFullExtension(e.target.value)}
      />
      <div className='flex w-full flex-row'>
        <Dropdown className=''>
          <DropdownTrigger>
            <Button
              isIconOnly
              variant='light'
              disableAnimation
              disableRipple
              className='w-full'
            >
              Condition
            </Button>
          </DropdownTrigger>
          <DropdownMenu variant='faded' aria-label='Chart Option'>
            <DropdownItem textValue='===' onClick={() => setExtension("===")}>
              {"==="}
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
            <DropdownItem textValue='!==' onClick={() => setExtension("!==")}>
              {"!=="}
            </DropdownItem>
            <DropdownItem textValue='&&' onClick={() => setExtension("&&")}>
              {"AND"}
            </DropdownItem>
            <DropdownItem textValue='||' onClick={() => setExtension("||")}>
              {"OR"}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className='w-full relative'>
          <button onClick={() => setValueOpen(!valueOpen)}>Value</button>
          {valueOpen && (
            <div className='absolute bottom-0'>
              <input
                className='val'
                placeholder='open'
                value={val}
                onChange={(e) => setVal(e.target.value)}
                onBlur={() => handleValue(val)}
              ></input>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaExtension;
