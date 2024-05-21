import { useAtom, useSetAtom } from "jotai";
import React, { useState } from "react";
import {
  deleteColumn,
  selectedProjectAtom,
  updateHeaderName,
} from "../../datastore";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from "@nextui-org/react";
import { SlOptionsVertical } from "react-icons/sl";

const EditableHeader = ({ data, accessorKey }) => {
  const [projects, setProjects] = useAtom(selectedProjectAtom);
  const [isClicked, setIsClicked] = useState(false);
  const [newHeaderName, setNewHeaderName] = useState(data);
  const [oldName, setOldName] = useState(data);

  const editHeader = useSetAtom(updateHeaderName);
  const projectId = projects.id;
  const key = accessorKey;

  const handleBlur = () => {
    editHeader(projectId, oldName, newHeaderName);
    setIsClicked(false);
  };
  const deleteHeader = useSetAtom(deleteColumn);
  const handleDelete = () => {
    deleteHeader(projectId, key);
  };
  console.log("Accessor: ", key);
  return (
    <div className='hover:cursor-text flex flex-row items-center justify-center relative w-full'>
      {!isClicked ? (
        <p onClick={() => setIsClicked(true)}>{data}</p>
      ) : (
        <Input
          placeholder='Title'
          value={newHeaderName}
          onChange={(e) => setNewHeaderName(e.target.value)}
          required
          onBlur={handleBlur}
        ></Input>
      )}
      <Dropdown>
        <DropdownTrigger>
          <button className='w-6 h-6 absolute items-center top-0 -right-6 justify-center p-1 opacity-0 rounded-md hover:bg-gray-200 hover:opacity-100'>
            <SlOptionsVertical />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label='Action event example'>
          <DropdownItem key='new' onClick={() => setIsClicked(true)}>
            Edit
          </DropdownItem>
          <DropdownItem
            key='delete'
            className='text-danger'
            color='danger'
            onClick={() => handleDelete()}
          >
            Delete file
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default EditableHeader;
