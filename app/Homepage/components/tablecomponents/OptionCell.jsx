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
import {
  addNewStatus,
  selectedProjectAtom,
  statusesData,
  updateDefaultStatus,
} from "../../datastore";
import { useAtom, useSetAtom } from "jotai";
import styles from "@/app/styles";
import { toast } from "sonner";

const OptionCell = ({ getValue, row, column, table }) => {
  const { text, color } = getValue() || {};
  const { updateData } = table.options.meta;
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);
  const [updateStatus, setUpdateStatus] = useState(null);
  //provided by nextui template
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([text]));
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );
  const columnKey = column.id;
  //function for color coding in status

  const checkColor = (color) => {
    if (color) {
      if (!color.startsWith("bg-")) {
        return `bg-${color}`;
      }
      return color;
    }
  };

  //modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //custom status
  const [newStatus, setNewStatus] = useState("");
  const [newColor, setNewColor] = useState("");
  const addStatus = useSetAtom(addNewStatus);
  const colorSelection = [
    { color: "bg-a-green" },
    { color: "bg-a-orange" },
    { color: "bg-a-red" },
    { color: "bg-a-blue" },
    { color: "bg-a-grey" },
  ];
  //function for custom status
  const handleCustomStatus = () => {
    if (newStatus && newColor) {
      if (selectedProject) {
        const prevStatus = selectedProject?.defaultStatus.find(
          (prev) =>
            prev?.text.toLocaleLowerCase() === newStatus.toLocaleLowerCase()
        );

        if (prevStatus === undefined) {
          addStatus(selectedProject._id, newStatus, newColor);
          setNewStatus("");
          setNewColor("");
          onOpenChange(false);
        } else {
          toast("Status already exists: ");
        }
      }
    } else {
      toast("Please fill out all fields");
    }
  };
  const handleSetStat = (stat) => {
    setNewColor(stat.color);
    setNewStatus(stat.text);
    setUpdateStatus(stat);
  };
  const handleClose = () => {
    setNewColor("");
    setNewStatus("");
    setUpdateStatus(null);
    onOpenChange(false);
  };
  const updateStat = useSetAtom(updateDefaultStatus);
  const handleUpdateStatus = () => {
    const oldStat = updateStatus?.text;
    if (newStatus === "") {
      toast("Please fill out all fields");
      return;
    } else {
      if (selectedProject) {
        const prevStatus = selectedProject?.defaultStatus.find(
          (prev) =>
            prev?.text.toLocaleLowerCase() === newStatus.toLocaleLowerCase()
        );
        const id = selectedProject._id;
        updateStat(id, columnKey, newStatus, newColor, updateStatus);
        setNewColor("");
        setNewStatus("");
        setUpdateStatus(null);
      }
    }
  };

  return (
    <>
      <Dropdown className='min-w-[0px] w-[180px]'>
        <div className={`${styles.flexCenter}`}>
          <DropdownTrigger>
            <Button
              variant='bordered'
              className={`capitalize w-[90%] ${checkColor(
                color
              )} min-h-[0px] h-[36px] rounded-lg border-1 ${
                checkColor(color) === "bg-a-grey" ||
                checkColor(color) === "bg-a-green"
                  ? "text-a-black"
                  : "text-a-white"
              }`}
            >
              <div
                className={`${
                  selectedValue === "" ? "flex" : "hidden"
                }text-a-black text-sm font-medium`}
              ></div>
              <div className={`${selectedValue !== "" ? "flex" : "hidden"}`}>
                {text}
              </div>
            </Button>
          </DropdownTrigger>
        </div>
        <DropdownMenu
          aria-label='Single selection example'
          variant='flat'
          disallowEmptySelection
          selectionMode='single'
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          {selectedProject?.defaultStatus.map((status) => (
            <DropdownItem
              key={status.text}
              onClick={() => updateData(row.index, column.id, status)}
              textValue={status.text}
            >
              <div className='flex justify-start items-center'>
                <div
                  className={`${status.color} w-[24px] h-[24px] rounded`}
                ></div>
                <p className='pl-[12px]'>{status.text}</p>
              </div>
            </DropdownItem>
          ))}
          <DropdownItem
            className='bg-a-grey text-center'
            key={" "}
            onClick={onOpen}
            textValue='Add New'
          >
            Add New Status
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className=''>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add Custom Status
              </ModalHeader>
              <ModalBody>
                <div className='w-full grid grid-cols-3 gap-2'>
                  {selectedProject?.defaultStatus.map((status, index) => (
                    <div
                      key={index}
                      onClick={() => handleSetStat(status)}
                      className={`rounded-md hover:cursor-pointer ${checkColor(
                        status.color
                      )} p-2 
                      ${
                        checkColor(status.color) === "bg-a-grey" ||
                        checkColor(status.color) === "bg-a-green"
                          ? "text-a-black"
                          : "text-a-white"
                      }`}
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
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    required
                  ></Input>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={handleClose}>
                  Close
                </Button>
                {updateStatus === null ? (
                  <Button color='primary' onClick={() => handleCustomStatus()}>
                    Add
                  </Button>
                ) : (
                  <Button color='primary' onClick={() => handleUpdateStatus()}>
                    Save
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default OptionCell;
