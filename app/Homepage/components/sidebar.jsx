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
  Image,
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
import LoadingComponent from "./otherComponents/LoadingComponent";
import styles from "@/app/styles";

import { IoMenu } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";

const Sidebar = () => {
  const data = useAtomValue(projectsAtom);
  const [userData, setUserData] = useAtom(UserDataAtom || {});
  const addNew = useSetAtom(addProject);
  const setSelectedProject = useSetAtom(selectedProject);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);

  const handleOpen = () => {
    if (toggle == false) {
      setToggle(true);
    } else {
      setToggle(false);
    }
  };

  const handleSelect = (task) => {
    setSelectedProject(task._id);
  };
  //handlers
  //Add New Project Handler
  const [title, setTitle] = useState("");
  const [privacy, setPrivacy] = useState("shared");
  const handleAddProject = async () => {
    if (title === "") {
      alert("Please enter a title");
      return;
    }
    setLoading(true);
    try {
      const status = await addNew({ title, privacy });
      if (status && status.success) {
        alert("Project added");
        setTitle("");
        setPrivacy("shared");
      } else {
        alert("Error adding project");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  //function to check if the user is owner or has access to the project
  const checkAccess = () => {
    if (userData && data) {
      console.log("data", data);
      const accessData = data.filter((project) =>
        project?.organizer?.some((person) => person?.sub === userData?.sub)
      );
      return accessData;
    }
    return [];
  };
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <div className='sm:hidden fixed z-30'>
        <Button
          isIconOnly
          onPress={handleOpen}
          variant='light'
          className={`${toggle ? "text-a-black" : "text-a-white"} m-[8px]`}
        >
          <IoMenu className='size-[80%]' />
        </Button>
      </div>

      <div
        className={`fixed sm:left-0 z-20 ${
          toggle ? `${styles.slideIn}` : `${styles.slideOut}`
        } ${styles.sideBar}`}
      >
        <div className={`w-full mt-2 ${styles.flexCenter}`}>
          <Image
            src='./Assets/Header.png'
            alt='Logo'
            width={160}
            className='ml-[16px] sm:ml-[0px]'
          ></Image>
        </div>

        <div
          className={`${styles.flexCenter} justify-between m-[12px] border-t-1 border-a-grey pt-[12px]`}
        >
          <span className='text-[16px] font-helvetica font-bold'>
            PROJECTS:
          </span>
          <Button onPress={onOpen} isIconOnly size='sm' className='bg-a-orange'>
            <IoAddOutline className='text-a-white size-[80%]' />
          </Button>
        </div>

        <div className='w-full flex flex-col items-center'>
          {loading ? (
            <LoadingComponent />
          ) : (
            checkAccess !== undefined &&
            checkAccess().map((task) => (
              <div
                className='w-[90%] py-[4px] px-[8px] mb-[4px] font-helvetica rounded-[8px] hover:bg-gray-200 hover:cursor-pointer flex items-center justify-between'
                key={task.id}
                onClick={() => handleSelect(task)}
              >
                <p>{task.name}</p>
                <OptionModal task={task} />
              </div>
            ))
          )}
        </div>

        <div className='w-full absolute bottom-0 left-0 '>
          <div className={`${styles.flexCenter}`}>
            <Button
              className='w-full m-[8px] bg-a-orange text-a-white'
              onClick={signOut}
            >
              Sign Out
            </Button>
          </div>
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
    </div>
  );
};

export default Sidebar;
