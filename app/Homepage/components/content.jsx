import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom, useSetAtom } from "jotai";
import { addGroupTask, selectedProjectAtom } from "../datastore";
import { IoIosArrowDropdown } from "react-icons/io";
import { Button } from "@nextui-org/react";

const columns = [
  {
    accessorKey: "item",
    header: "Item",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "managers",
    header: "Managers",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "processors",
    header: "Processor",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "dateCompleted",
    header: "DateCompleted",
    cell: (props) => <p>{props.getValue()}</p>,
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: (props) => <p>{props.getValue()}</p>,
  },
];
const Content = () => {
  const [data, setData] = useAtom(selectedProjectAtom);
  //   const table = useReactTable({
  //     data,
  //     columns,
  //     getCoreRowModel: getCoreRowModel(),
  //     columnResizeMode: "onChange",
  //     enableColumnResizing: true,
  //     meta: {
  //       updateData: (rowIndex, columnId, value) =>
  //         setData((prev) =>
  //           prev.map((row, index) =>
  //             index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row
  //           )
  //         ),
  //     },
  //   });

  //function to toggle dropdown of each groupTask
  const [openDrop, setOpenDrop] = useState([]);
  const toggleDropdown = (groupId) => {
    if (openDrop.includes(groupId)) {
      setOpenDrop(openDrop.filter((id) => id !== groupId));
    } else {
      setOpenDrop([...openDrop, groupId]);
    }
  };

  const addNewGroup = useSetAtom(addGroupTask);
  const handleAddGroup = (data) => {
    const id = data.id;
    addNewGroup(id);
  };

  console.log("data: ", data);
  return (
    <div className='p-2 flex flex-col w-full'>
      <p>{data?.name}</p>
      <div className='w-full justify-start'>
        <Button onClick={() => handleAddGroup(data)}>New Group</Button>
      </div>
      <div className='w-full flex flex-col space-y-4'>
        {data.grouptask.map((groupData) => (
          <div
            className={`w-full  
            ${!openDrop.includes(groupData.id) ? "bg-gray-200 border" : ""}
          hover:cursor-pointer flex items-center p-2`}
            key={groupData.id}
            onClick={() => toggleDropdown(groupData.id)}
          >
            {openDrop.includes(groupData.id) ? <IoIosArrowDropdown /> : "<"}
            {groupData.groupName}
            {openDrop.includes(groupData.id) && (
              <div>Dropdown content here</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
