import { useAtom, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
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
  Skeleton,
} from "@nextui-org/react";

import { SlOptionsVertical } from "react-icons/sl";
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import styles from "@/app/styles";
import { toast } from "sonner";

const EditableHeader = ({ data, accessorKey }) => {
  const [projects, setProjects] = useAtom(selectedProjectAtom);
  const [isClicked, setIsClicked] = useState(false);
  const [newHeaderName, setNewHeaderName] = useState(data);
  const [oldName, setOldName] = useState(accessorKey);
  const [loading, setLoading] = useState(false);

  const editHeader = useSetAtom(updateHeaderName);
  const projectId = projects._id;
  const key = accessorKey;

  const handleBlur = async () => {
    setLoading(true);
    try {
      const status = await editHeader(projectId, oldName, newHeaderName);
      if (!status && !status.success) {
        toast("Error updating");
      }
      setIsClicked(false);
    } catch (e) {
      setIsClicked(false);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const deleteHeader = useSetAtom(deleteColumn);
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete")) {
      setLoading(true);
      try {
        const status = await deleteHeader(projectId, key);
        if (status && status.success) {
          toast("Column deleted");
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className='hover:cursor-text flex flex-row items-center justify-center relative w-full h-full'>
      {loading ? (
        <div className='text-a-grey font-light text-sm w-full h-full'>
          <Skeleton className='rounded-lg w-full h-[32px] my-[4px]'></Skeleton>
        </div>
      ) : !isClicked ? (
        <p className='text-base font-bold' onClick={() => setIsClicked(true)}>
          {data}
        </p>
      ) : (
        <Input
          placeholder='Title'
          value={newHeaderName}
          onChange={(e) => setNewHeaderName(e.target.value)}
          required
          onBlur={handleBlur}
          size='sm'
          className={`ml-[4px]`}
          classNames={{ inputWrapper: "bg-a-grey focus-within:!bg-a-grey" }}
        ></Input>
      )}

      <Dropdown className='w-[132px] min-w-[0px] p-[0px]'>
        <DropdownTrigger>
          <Button
            isIconOnly
            size='sm'
            className={`m-[4px] bg-a-grey ${
              isClicked
                ? `flex`
                : `absolute right-0 opacity-0 hover:opacity-100`
            } `}
          >
            <SlOptionsVertical />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label='Action event example'>
          <DropdownItem key='new' onClick={() => setIsClicked(true)}>
            <div className='flex justify-left items-center'>
              <MdOutlineEdit size={24} className='' />
              <p className='pl-[8px]'>Edit File</p>
            </div>
          </DropdownItem>
          <DropdownItem
            key='delete'
            className='text-danger'
            color='danger'
            onClick={() => handleDelete()}
          >
            <div className='flex justify-left items-center'>
              <MdOutlineDelete size={24} className='' />
              <p className='pl-[8px]'>Delete File</p>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default EditableHeader;
