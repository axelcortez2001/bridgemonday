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
import { useAtom, useSetAtom } from "jotai";
import {
  addProject,
  projectsAtom,
  selectedProject,
  UserDataAtom,
} from "../datastore";
import { SlOptions } from "react-icons/sl";
import OptionModal from "./sidebarcomponents/OptionModal";
const Sidebar = () => {
  const [data, setData] = useAtom(projectsAtom);
  const [userData, setUserData] = useAtom(UserDataAtom);
  const addNew = useSetAtom(addProject);
  const setSelectedProject = useSetAtom(selectedProject);

  //handlers
  //Add New Project Handler
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

  //function to check if the user is owner or has access to the project
  const checkAccess = () => {
    if (userData && data) {
      const accessData = data.filter(
        (project) =>
          userData.sub.includes(project.organizer.sub) ||
          project?.grouptask.map((groupData) =>
            groupData?.task.map((taskData) =>
              taskData?.processors.map((user) =>
                userData.sub.includes(user.sub)
              )
            )
          ) ||
          project?.grouptask.map((groupData) =>
            groupData?.task.map((taskData) =>
              taskData?.managers.map((user) => userData.sub.includes(user.sub))
            )
          )
      );
      console.log("Access: ", accessData);
      return accessData;
    }
  };
  console.log(checkAccess());

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  console.log("UserData: ", userData);
  return (
    <div className='w-60 min-w-60 h-screen flex flex-col border border-gray-900'>
      <div className='w-full p-2'>Home</div>
      <div className='w-full p-2'>My Work</div>
      <div className='w-full h-5 p-2 border-b-1'></div>
      <div>
        <Button onPress={onOpen}>Add Project</Button>
      </div>
      <div className='w-full flex flex-col'>
        {checkAccess().map((task) => (
          <div
            className='w-full p-2 hover:bg-gray-200 hover:cursor-pointer flex items-center justify-between'
            key={task.id}
            onClick={() => setSelectedProject(task.id)}
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
