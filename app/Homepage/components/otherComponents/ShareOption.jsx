import React from "react";
import {
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
const ShareOption = () => {
  const handleClick = () => {
    console.log("Share Clicked");
  };
  return (
    <DropdownItem key='share' onClick={() => handleClick()}>
      Share
    </DropdownItem>
  );
};

export default ShareOption;
