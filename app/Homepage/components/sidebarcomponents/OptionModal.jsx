import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
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
import { MdDeleteOutline, MdOutlineModeEdit } from "react-icons/md";
import { SlOptions } from "react-icons/sl";
import { useSetAtom } from "jotai";
import { deleteProject, editProject } from "../../datastore";
import LoadingComponent from "../otherComponents/LoadingComponent";

export default function OptionModal({ task }) {
  //modal options
  const [title, setTitle] = useState(task.name);
  const [privacy, setPrivacy] = useState(task.type);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  //function to delete
  const deleteHandle = useSetAtom(deleteProject);
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete?")) {
      setLoading(true);
      try {
        const id = task._id;
        const status = await deleteHandle(id);
        if (status && status.success) {
          alert("Project deleted");
        } else {
          alert("Error Deleting Project");
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };
  //function to edt
  const editHandle = useSetAtom(editProject);
  const handleEdit = async () => {
    setLoading(true);
    try {
      const id = task._id;
      const status = await editHandle(id, title, privacy);
      if (status && status.success) {
        onOpenChange(false);
      } else {
        onOpenChange(false);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return loading ? (
    <LoadingComponent />
  ) : (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button className='h-full  hover:bg-gray-400 flex items-center p-1 rounded-md'>
            <SlOptions size={15} />
          </button>
        </DropdownTrigger>
        <DropdownMenu variant='faded' aria-label='Dropdown menu with icons'>
          <DropdownItem
            key='edit'
            startContent={<MdOutlineModeEdit className={iconClasses} />}
            onClick={onOpen}
          >
            Edit file
          </DropdownItem>
          <DropdownItem
            key='delete'
            className='text-danger'
            color='danger'
            startContent={
              <MdDeleteOutline className={cn(iconClasses, "text-danger")} />
            }
            onClick={handleDelete}
          >
            Delete file
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Edit</ModalHeader>
              <ModalBody>
                {" "}
                <Input
                  placeholder='Title'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                ></Input>
                {task.type === "shared" ? (
                  <div>Project cannot be converted to personal</div>
                ) : (
                  <RadioGroup
                    label='Privacy'
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                  >
                    <Radio value='shared'>Shared</Radio>
                    <Radio value='personal'>Personal</Radio>
                  </RadioGroup>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color='primary'
                  onPress={onClose}
                  onClick={() => handleEdit()}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
