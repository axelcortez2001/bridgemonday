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
import { addProject, projectsAtom, selectedProject } from "../datastore";
import { SlOptions } from "react-icons/sl";
const Sidebar = () => {
  const [data, setData] = useAtom(projectsAtom);
  const addNew = useSetAtom(addProject);
  const setSelectedProject = useSetAtom(selectedProject);

  //handlers
  //Add New Project Handler
  const [title, setTitle] = useState("");
  const [privacy, setPrivacy] = useState("shared");
  const handleAddProject = () => {
    console.log("trigger");
    addNew({ title, privacy });
    setTitle("");
    setPrivacy("shared");
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className='w-60 min-w-60 h-screen flex flex-col border border-gray-900'>
      <div className='w-full p-2'>Home</div>
      <div className='w-full p-2'>My Work</div>
      <div className='w-full h-5 p-2 border-b-1'></div>
      <div>
        <Button onPress={onOpen}>Add Project</Button>
      </div>
      <div className='w-full flex flex-col'>
        {data.map((task) => (
          <div
            className='w-full p-2 hover:bg-gray-200 hover:cursor-pointer flex items-center justify-between'
            key={task.id}
            onClick={() => setSelectedProject(task.id)}
          >
            <p>{task.name}</p>
            <div className='h-full hover:bg-gray-400 flex items-center p-1 rounded-md'>
              <SlOptions size={15} />
            </div>
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
                  onChange={(value) => setPrivacy(value)}
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
