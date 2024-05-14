"use client";
import { Input } from "@nextui-org/react";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { updateGroupName } from "../datastore";

const EditableGroupName = ({ projectId, groupData }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [newGroupName, setGroupTitle] = useState(groupData.groupName);
  const groupId = groupData.id;
 
  const updateName = useSetAtom(updateGroupName);
  const handleBlur = () => {
    updateName({ projectId, groupId, newGroupName });
    setIsClicked(false);
  };
  return (
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
  );
};

export default EditableGroupName;
