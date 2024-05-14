import React, { useState } from "react";

import { useAtom, useSetAtom } from "jotai";
import { addGroupTask, selectedProjectAtom } from "../datastore";
import { IoIosArrowDropdown } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from "react-icons/md";
import { Button } from "@nextui-org/react";
import Tasktable from "./tasktable";
import EditableGroupName from "./EditableGroupName";

const Content = () => {
  const [data, setData] = useAtom(selectedProjectAtom);
  //function to toggle dropdown of each groupTask
  const [openDrop, setOpenDrop] = useState([]);
  const toggleDropdown = (groupId) => {
    if (openDrop.includes(groupId)) {
      setOpenDrop(openDrop.filter((id) => id !== groupId));
    } else {
      setOpenDrop([...openDrop, groupId]);
    }
  };

  //Handlers
  //handler to add new group
  const addNewGroup = useSetAtom(addGroupTask);
  const handleAddGroup = (data) => {
    const id = data.id;
    addNewGroup(id);
  };
  return (
    <div className='p-2 flex flex-col w-full max-h-screen overflow-y-auto'>
      <p>{data?.name}</p>
      <div className='w-full justify-start mb-2'>
        {data !== undefined && (
          <Button onClick={() => handleAddGroup(data)}>New Group</Button>
        )}
      </div>
      <div className='w-full flex flex-col space-y-4'>
        {data?.grouptask.map((groupData) => (
          <div
            className={`w-full  
            ${!openDrop.includes(groupData.id) ? "bg-gray-200 border" : ""}
          hover:cursor-pointer flex flex-col items-center p-2`}
            key={groupData.id}
          >
            <div className='flex w-full justify-start items-center'>
              {openDrop.includes(groupData.id) ? (
                <MdKeyboardArrowDown
                  onClick={() => toggleDropdown(groupData.id)}
                />
              ) : (
                <MdKeyboardArrowLeft
                  onClick={() => toggleDropdown(groupData.id)}
                />
              )}
              <div
                className={`${
                  !openDrop.includes(groupData.id) ? "" : " font-semibold"
                }`}
              >
                <EditableGroupName projectId={data.id} groupData={groupData} />
              </div>
            </div>
            {openDrop.includes(groupData.id) && (
              <Tasktable
                projectId={data.id}
                groupId={groupData.id}
                groupData={groupData.task}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
