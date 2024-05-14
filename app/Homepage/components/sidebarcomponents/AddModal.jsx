import React, { useState } from "react";
import {
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
import { useSetAtom } from "jotai";
import { addProject } from "../../datastore";
const { isOpen, onOpen, onOpenChange } = useDisclosure();
const AddModal = () => {
  const addNew = useSetAtom(addProject);
  const [title, setTitle] = useState("");
  const [privacy, setPrivacy] = useState("shared");
  const handleAddProject = () => {
    console.log("trigger");
    if (title === "") {
      alert("Please enter a title");
      return;
    }
    addNew({ title, privacy });
    setTitle("");
    setPrivacy("shared");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              Add New Project
            </ModalHeader>
            <ModalBody>
              <Input
                placeholder='Title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              ></Input>
              <RadioGroup
                label='Privacy'
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <Radio value='shared'>Shared</Radio>
                <Radio value='personal'>Personal</Radio>
              </RadioGroup>
            </ModalBody>
            <ModalFooter>
              <Button color='danger' variant='light' onPress={onClose}>
                Close
              </Button>
              <Button
                color='primary'
                onPress={onClose}
                onClick={() => handleAddProject()}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddModal;
