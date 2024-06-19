"use client";
import {
  Input,
  Skeleton,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { deleteGroupTask, updateGroupName } from "../datastore";
import { MdDeleteOutline, MdOutlineModeEdit, MdIosShare } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { toast } from "sonner";

const EditableGroupName = ({ projectId, groupData }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [newGroupName, setGroupTitle] = useState(groupData.groupName);
  const delGroup = useSetAtom(deleteGroupTask);
  const groupId = groupData.id;
  const [loading, setLoading] = useState(false);

  const updateName = useSetAtom(updateGroupName);
  const handleBlur = async () => {
    setLoading(true);
    try {
      const status = await updateName({ projectId, groupId, newGroupName });
      if (!status && !status.success) {
        toast("Error updating group");
      }
      setIsClicked(false);
    } catch (error) {
      setIsClicked(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = () => {
    const groupId = groupData.id;
    if (window.confirm(`Are you sure you want to delete`)) {
      delGroup(projectId, groupId);
    }
  };
  return (
    <div className='flex w-full justify-between items-center whitespace-nowrap'>
      <div>
        <Dropdown className='w-[132px] min-w-[0px] p-[0px]'>
          <DropdownTrigger>
            <Button
              isIconOnly
              size='sm'
              variant='light'
              disableAnimation
              disableRipple
              className='mr-[4px]'
            >
              <SlOptionsVertical />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem onPress={() => setIsClicked(true)}>
              <div className='justify-start items-center flex space-x-2'>
                <MdOutlineModeEdit /> <span className='text-a-black'>Edit</span>
              </div>
            </DropdownItem>
            <DropdownItem onPress={() => handleDelete()}>
              <div className='justify-start items-center flex space-x-2'>
                <MdDeleteOutline className='text-a-red' />{" "}
                <span className='text-a-red'>Delete</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className='hover:cursor-text'>
        {loading ? (
          <div className='text-a-grey font-light text-sm w-full'>
            <Skeleton className='rounded-lg w-full h-[32px] my-[4px]'></Skeleton>
          </div>
        ) : !isClicked ? (
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
    </div>
  );
};

export default EditableGroupName;
