"use client";
import { Input } from "@nextui-org/react";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { deleteGroupTask, updateGroupName } from "../datastore";
import { MdDeleteOutline, MdOutlineModeEdit, MdIosShare } from "react-icons/md";

const EditableGroupName = ({ projectId, groupData }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [newGroupName, setGroupTitle] = useState(groupData.groupName);
  const delGroup = useSetAtom(deleteGroupTask);
  const groupId = groupData.id;

  const updateName = useSetAtom(updateGroupName);
  const handleBlur = () => {
    updateName({ projectId, groupId, newGroupName });
    setIsClicked(false);
  };
  const handleDelete = () => {
    const groupId = groupData.id;
    if (window.confirm(`Are you sure you want to delete`)) {
      delGroup(projectId, groupId);
    }
  };
  return (
    <div className='flex w-full justify-between items-center'>
      <div className='hover:cursor-text'>
        {!isClicked ? (
          <p onClick={() => setIsClicked(true)}>{groupData.groupName}</p>
        ) : (
          <Input
            placeholder='Title'
            value={newGroupName}
            onChange={(e) => setGroupTitle(e.target.value)}
            required
            onBlur={handleBlur}
          ></Input>
        )}
      </div>
      <div className='flex flex-row gap-x-3 ml-5'>
        <div onClick={() => setIsClicked(true)}>
          <MdOutlineModeEdit />
        </div>
        <div onClick={() => handleDelete()}>
          <MdDeleteOutline />
        </div>
      </div>
    </div>
  );
};

export default EditableGroupName;
