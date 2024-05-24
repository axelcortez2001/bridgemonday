import { useAtom, useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import { selectedProjectAtom, userAtom, UserDataAtom } from "../../datastore";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";

const PersonCell = ({ getValue, row, column, table }) => {
  const projects = useAtom(selectedProjectAtom);
  const currentUser = useAtomValue(UserDataAtom);
  const [personAtom, setPersonAtom] = useAtom(userAtom);
  const [filteredPerson, setFilteredPerson] = useState(personAtom);
  const initialValue = getValue();
  const value = initialValue?.map((user) => user.sub) || [];
  const { updateData } = table.options.meta;
  console.log("person Atom:", personAtom);
  //function to show and find user
  const findUserData = (userAtom, sub) => {
    const allusers = userAtom.filter((userMap) => sub?.includes(userMap.sub));
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
            className='absolute flex items-center justify-center text-red-500 top-0 right-1 rounded-full border bg-gray-200 h-4 w-4
          hover:bg-red-500 hover:text-white'
            onClick={() => deleteUserData(user)}
          >
            x
          </div>
        </div>
      ))
    );
  };

  //show suggested User
  const showSuggested = (userAtom, sub) => {
    console.log("sub:", sub);
    console.log("userAtom:", userAtom);
    const allusers =
      projects[0].type === "shared"
        ? userAtom.filter((userMap) => !sub?.includes(userMap.sub))
        : userAtom.find((userMap) => sub?.includes(userMap.sub))
        ? []
        : [currentUser];
    console.log("allusers:", projects[0].type);
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
  };
  //modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  //function to search
  const [searchText, sertSearchText] = useState("");
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
  //function to updateuserData
  const updateUserData = (user) => {
    console.log("Initial: ", initialValue);
    const newData =
      initialValue !== undefined ? [...initialValue, user] : [user];
    console.log("NewData: ", newData);
    updateData(row.index, column.id, newData);
    sertSearchText("");
  };
  //function to delete userData
  const deleteUserData = (data) => {
    const newData = initialValue.filter((user) => user.sub !== data.sub);
    updateData(row.index, column.id, newData);
  };
  return (
    <div className='w-full flex flex-wrap items-center justify-center'>
      {value !== undefined ? (
        <>
          {value.map((user) => findUserData(personAtom, user))}
          <div
            onClick={onOpen}
            className='flex p-2 border rounded-full h-5 w-5 justify-center items-center 
          hover:cursor-pointer hover:bg-gray-500 '
          >
            +
          </div>
        </>
      ) : (
        <div
          onClick={onOpen}
          className='flex p-2 border rounded-full h-5 w-5 justify-center items-center 
          hover:cursor-pointer hover:bg-gray-500 '
        >
          +
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className=' max-h-96 h-96'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Add New User
              </ModalHeader>
              <ModalBody>
                <div className='flex'>{findUserData(personAtom, value)}</div>
                <Input
                  placeholder='Search here...'
                  value={searchText}
                  onChange={(e) => sertSearchText(e.target.value)}
                  required
                ></Input>
                <p>Suggested</p>
                <div className='w-full max-h-40 overflow-y-auto '>
                  <div className='flex flex-col gap-y-1 max-h-full overflow-y-auto'>
                    {showSuggested(filteredPerson, value)}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                {/* <Button color='primary' onPress={onClose}>
                  Add
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PersonCell;
