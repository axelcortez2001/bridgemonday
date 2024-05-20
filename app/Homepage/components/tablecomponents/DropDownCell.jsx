import React, { useState } from "react";
import {
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
  Input,
} from "@nextui-org/react";
import { addNewDropDown, selectedProjectAtom } from "../../datastore";
import { useAtom, useSetAtom } from "jotai";

const DropDownCell = ({ getValue, row, column, table }) => {
  const { text, color } = getValue() || {};
  const { updateData } = table.options.meta;
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);
  const [newDropDown, setNewDropDown] = useState("");
  const [newColor, setNewColor] = useState("");
  //provided by nextui template
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([text]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  //function for color coding in status
  const checkColor = (color) => {
    if (color) {
      if (!color.startsWith("bg-")) {
        return `bg-${color}`;
      }
      return color;
    }
  };
  const colorSelection = [
    { color: "bg-blue-700" },
    { color: "bg-red-700" },
    { color: "bg-green-700" },
    { color: "bg-yellow-700" },
  ];

  const addDropDown = useSetAtom(addNewDropDown);
  const handleDropDown = () => {
    if (newDropDown && newColor) {
      if (selectedProject) {
        const prevStatus = selectedProject?.defaultDropDown.find(
          (prev) =>
            prev?.text.toLocaleLowerCase() === newDropDown.toLocaleLowerCase()
        );

        if (prevStatus === undefined) {
          addDropDown(selectedProject.id, newDropDown, newColor);
          setNewDropDown("");
          setNewColor("");
          onOpenChange(false);
        } else {
          alert("DropDown already exists: ");
        }
      }
    } else {
      alert("Please fill out all fields");
    }
  };
  //modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
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
          {selectedProject?.defaultDropDown?.map((status) => (
            <DropdownItem
              key={status.text}
              onClick={() => updateData(row.index, column.id, status)}
              className={`${status.color} `}
              textValue={status.text}
            >
              <p>{status.text}</p>
            </DropdownItem>
          ))}
          <DropdownItem
            className='bg-gray-200'
            key={" "}
            onClick={onOpen}
            textValue='Add New'
          >
            +Add New DropDown
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className=''>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add New DropDown
              </ModalHeader>
              <ModalBody>
                <div className='w-full grid grid-cols-3 gap-2'>
                  {selectedProject?.defaultDropDown.map((status, index) => (
                    <div
                      key={index}
                      className={`rounded-md ${checkColor(status.color)} p-2`}
                    >
                      {status.text}
                    </div>
                  ))}
                </div>
                <div>
                  <p>Select Color</p>
                  <div className='flex flex-row gap-x-1'>
                    {colorSelection.map((color, index) => (
                      <div
                        key={index}
                        className={`h-8 w-8 rounded-md border hover:cursor-pointer ${checkColor(
                          color.color
                        )}`}
                        onClick={() => setNewColor(color.color)}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className='flex items-center gap-x-2'>
                  <div
                    className={`h-8 w-8 rounded-md border ${
                      newColor && checkColor(newColor)
                    }`}
                  ></div>
                  <Input
                    placeholder='Text here...'
                    value={newDropDown}
                    onChange={(e) => setNewDropDown(e.target.value)}
                    required
                  ></Input>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onClick={() => handleDropDown()}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DropDownCell;
