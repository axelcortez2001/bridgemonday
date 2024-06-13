import React, { useEffect, useState } from "react";
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
import { SlOptions } from "react-icons/sl";
import {
  MdDeleteOutline,
  MdOutlineModeEdit,
  MdIosShare,
  MdOutlineSwapHoriz,
} from "react-icons/md";
import { TiExport, TiExportOutline } from "react-icons/ti";

import { useAtom, useSetAtom } from "jotai";
import {
  changeOwnerShip,
  deleteProject,
  editProject,
  removeOrganizer,
  setOrganizers,
  userAtom,
  UserDataAtom,
} from "../../datastore";
import LoadingComponent from "./LoadingComponent";
const ProjectOption = ({ data, exportCsv }) => {
  const [title, setTitle] = useState(data.name);
  const [privacy, setPrivacy] = useState(data.type);
  const [modalSelected, setModalSelected] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);

  useEffect(() => {
    setTitle(data.name);
    setPrivacy(data.type);
  }, [data]);

  //for user sharing
  const [personAtom, setPersonAtom] = useAtom(userAtom);
  const userData = useAtom(UserDataAtom);
  const initialValue = data?.organizer?.map((organizer) => organizer);
  const [filteredPerson, setFilteredPerson] = useState(personAtom);
  const [searchText, sertSearchText] = useState("");
  const removeOrganizerData = useSetAtom(removeOrganizer);
  const setOrganizerData = useSetAtom(setOrganizers);
  //search functionality
  useEffect(() => {
    const searchData = () => {
      if (searchText === "") {
        setFilteredPerson(personAtom);
      } else {
        const user = personAtom.filter((person) =>
          person.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredPerson(user);
      }
    };
    searchData();
  }, [searchText, sertSearchText]);
  //show owner
  const showOwner = (sub) => {
    const initialUser = sub?.filter((user) => user.organizer === true);
    return initialUser[0].name;
  };
  const checkOwner = (sub) => {
    const initialUser = sub?.filter((user) => user.organizer === true);
    const owner = initialUser[0].sub;
    if (owner === userData[0].sub) {
      return true;
    } else {
      return false;
    }
  };
  //function to remove shared user
  const deleteUserData = async (user) => {
    const projectId = data._id;
    const sub = user.sub;
    const status = await removeOrganizerData(projectId, sub);
    if (status && status.success) {
      alert(status.message);
    } else {
      alert(status.message);
    }
    sertSearchText("");
  };
  //function to add user to project
  const updateUserData = async (user) => {
    const projectId = data._id;
    const status = await setOrganizerData(projectId, user);
    if (status && status.success) {
      alert(status.message);
    } else {
      alert(status.message);
    }
    sertSearchText("");
  };
  //show suggested User
  const showSuggested = (userAtom, sub) => {
    const initialUser = sub?.filter((user) => user.organizer === false);
    if (initialUser) {
      const initialUserAtom = userAtom.filter(
        (user) => initialUser[0]?.sub !== user.sub
      );
      const allusers = initialUserAtom.filter((user) =>
        sub.every((subUser) => user.sub !== subUser.sub)
      );
      return (
        allusers !== undefined &&
        allusers.map((user, index) => (
          <div
            className='border rounded-md p-1 flex items-center justify-start space-x-2 
        hover:bg-gray-200 hover:bg-opacity-80 hover:cursor-pointer'
            onClick={() => updateUserData(user)}
            key={index}
          >
            <img
              className='w-8 h-8 rounded-full'
              src={user?.picture}
              alt='user'
            />
            <p>{user.name}</p>
          </div>
        ))
      );
    }
  };
  //fuinction to show shared User
  const findUserData = (userAtom, sub) => {
    const initialUser = sub?.filter((user) => user.organizer === true);
    const initialUserAtom = userAtom.filter(
      (user) => initialUser[0].sub !== user.sub
    );
    const allusers = initialUserAtom.filter((user) =>
      sub.some((subUser) => user.sub === subUser.sub)
    );
    return (
      allusers !== undefined &&
      allusers.map((user, index) => (
        <div className='flex p-2 relative' key={index}>
          <img
            className='w-8 h-8 rounded-full'
            src={user?.picture}
            alt='user'
          />
          <div
            className='absolute flex items-center justify-center text-red-500 top-0 right-1 rounded-full border bg-gray-200 h-4 w-4 hover:cursor-pointer
            hover:bg-red-500 hover:text-white'
            onClick={() => deleteUserData(user)}
          >
            x
          </div>
        </div>
      ))
    );
  };
  //fuinction to show shared User
  const changeOwner = useSetAtom(changeOwnerShip);
  const handleChange = async (user) => {
    const userSub = user.sub;
    const id = data._id;
    if (
      window.confirm(
        `Are you sure you want to change ownership to ${user.name}`
      )
    ) {
      setOwnerLoading(true);
      try {
        const status = await changeOwner(id, userSub);
        if (status && status.success === true) {
          alert(`${user.name} is now the owner`);
        } else {
          alert("Error encountered");
        }
      } catch (e) {
        console.log(e);
      } finally {
        setOwnerLoading(false);
        onOpenChange(false);
      }
    }
  };
  const showChangeOwnership = (userAtom, sub) => {
    const initialUser = sub?.filter((user) => user.organizer === true);
    const initialUserAtom = userAtom.filter(
      (user) => initialUser[0].sub !== user.sub
    );
    const allusers = initialUserAtom.filter((user) =>
      sub.some((subUser) => user.sub === subUser.sub)
    );
    return (
      allusers !== undefined &&
      allusers.map((user, index) => (
        <div
          className='border rounded-md p-1 flex items-center justify-start space-x-2 
      hover:bg-gray-200 hover:bg-opacity-80 hover:cursor-pointer'
          key={index}
          onClick={() => handleChange(user)}
        >
          <img
            className='w-8 h-8 rounded-full'
            src={user?.picture}
            alt='user'
          />
          <p>{user.name}</p>
        </div>
      ))
    );
  };
  //handlers
  const deleteHandle = useSetAtom(deleteProject);
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete?")) {
      if (checkOwner(initialValue) === true) {
        setLoading(true);
        try {
          const id = data?._id;
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
      } else {
        alert("Please contact the owner of the project");
      }
    }
  };
  const editHandle = useSetAtom(editProject);
  const modalClick = (state) => {
    setModalSelected(state);
    onOpen();
  };
  const handleEdit = async () => {
    setLoading(true);
    try {
      const id = data?._id;
      const status = await editHandle(id, title, privacy);
      if (status && status.success) {
        onOpenChange(false);
      } else {
        onOpenChange(false);
      }
    } catch (error) {
      console.log(error);
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
          <Button
            isIconOnly
            size='sm'
            className='bg-a-orange text-white text-md'
          >
            <SlOptions />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label='Action event example'>
          {data && data !== undefined && (
            <DropdownItem
              key='edit'
              startContent={<MdOutlineModeEdit className={iconClasses} />}
              onClick={() => modalClick("edit")}
            >
              Edit
            </DropdownItem>
          )}
          {data?.type === "shared" && (
            <DropdownItem
              key='share'
              startContent={<MdIosShare className={iconClasses} />}
              onClick={() => modalClick("share")}
            >
              Share
            </DropdownItem>
          )}
          {data?.type === "shared" && checkOwner(initialValue) === true && (
            <DropdownItem
              key='share'
              startContent={<MdOutlineSwapHoriz className={iconClasses} />}
              onClick={() => modalClick("change")}
            >
              Change Ownership
            </DropdownItem>
          )}
          {data?.grouptask && data?.grouptask?.length > 0 && (
            <DropdownItem
              key='noSub'
              startContent={<TiExportOutline className={iconClasses} />}
              onClick={() => exportCsv("noSub")}
            >
              Export CSV without SubItems
            </DropdownItem>
          )}
          {data?.grouptask && data?.grouptask?.length > 0 && (
            <DropdownItem
              key='sub'
              startContent={<TiExport className={iconClasses} />}
              onClick={() => exportCsv("Sub")}
            >
              Export CSV with SubItems
            </DropdownItem>
          )}
          {data && data !== undefined && (
            <DropdownItem
              startContent={
                <MdDeleteOutline className={cn(iconClasses, "text-danger")} />
              }
              className='text-danger'
              color='danger'
              key='delete'
              onClick={() => handleDelete()}
            >
              Delete
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        {modalSelected === "edit" ? (
          //Edit Project
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Edit</ModalHeader>
                <ModalBody>
                  <Input
                    placeholder='Title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  ></Input>
                  {data?.type === "shared" ? (
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
        ) : modalSelected === "share" ? (
          //Share to other users
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className='flex flex-col gap-1'>
                  Share to other User
                </ModalHeader>
                <ModalBody>
                  <p>
                    <span className='font-semibold'>Owner: </span>{" "}
                    {showOwner(initialValue)}
                  </p>
                  <div className='flex'>
                    {findUserData(personAtom, initialValue)}
                  </div>
                  <Input
                    placeholder='Search here...'
                    value={searchText}
                    onChange={(e) => sertSearchText(e.target.value)}
                  ></Input>
                  <p>Suggested</p>
                  <div className='w-full max-h-40 overflow-y-auto '>
                    <div className='flex flex-col gap-y-1 max-h-full overflow-y-auto'>
                      {showSuggested(filteredPerson, initialValue)}
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color='danger' variant='light' onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        ) : (
          //Change Ownership
          <ModalContent>
            {(onClose) => (
              <>
                {ownerLoading ? (
                  <>
                    <LoadingComponent />
                  </>
                ) : (
                  <>
                    <ModalHeader className='flex flex-col gap-1'>
                      Change Ownership
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        <span className='font-semibold'>Owner: </span>{" "}
                        {showOwner(initialValue)}
                      </p>
                      <p>Select User</p>

                      <div className='w-full max-h-40 overflow-y-auto '>
                        <div className='flex flex-col gap-y-1 max-h-full overflow-y-auto'>
                          {showChangeOwnership(filteredPerson, initialValue)}
                        </div>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color='danger' variant='light' onPress={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </>
            )}
          </ModalContent>
        )}
      </Modal>
    </>
  );
};
export default ProjectOption;
