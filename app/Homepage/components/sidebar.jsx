"use client";
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
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  addProject,
  projectsAtom,
  selectedProject,
  UserDataAtom,
} from "../datastore";
import { SlOptions } from "react-icons/sl";
import OptionModal from "./sidebarcomponents/OptionModal";
import { signOut } from "aws-amplify/auth";

const Sidebar = () => {
  const data = useAtomValue(projectsAtom);
  const [userData, setUserData] = useAtom(UserDataAtom || {});
  const addNew = useSetAtom(addProject);
  const setSelectedProject = useSetAtom(selectedProject);

  const handleSelect = (task) => {
    console.log("Trigger select: ", task._id);
    setSelectedProject(task._id);
  };
  //handlers
  //Add New Project Handler
  const [title, setTitle] = useState("");
  const [privacy, setPrivacy] = useState("shared");
  const handleAddProject = () => {
    if (title === "") {
      alert("Please enter a title");
      return;
    }
    addNew({ title, privacy });
    setTitle("");
    setPrivacy("shared");
  };
  //function to check if the user is owner or has access to the project
  const checkAccess = () => {
    if (userData && data) {
      console.log("data", data);
      const accessData = data.filter(
        (project) =>
          project?.organizer?.some((person) => person?.sub === userData?.sub)
      );
      return accessData;
    }
    return [];
  };
  console.log("Access: ", checkAccess());
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className='w-60 min-w-60 h-screen flex flex-col border border-gray-900'>
      <div className='w-full p-2'>Home</div>
      <div className='w-full p-2'>My Work</div>
      <div>
        <Button onClick={signOut}>Signout</Button>
      </div>
      <div className='w-full h-5 p-2 border-b-1'></div>
      <div>
        <Button onPress={onOpen}>Add Project</Button>
      </div>
      <div className='w-full flex flex-col'>
        {checkAccess !== undefined &&
          checkAccess().map((task) => (
            <div
              className='w-full p-2 hover:bg-gray-200 hover:cursor-pointer flex items-center justify-between'
              key={task.id}
              onClick={() => handleSelect(task)}
            >
              <p>{task.name}</p>
              <OptionModal task={task} />
            </div>
          ))}
      </div>
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
    </div>
  );
};

export default Sidebar;
