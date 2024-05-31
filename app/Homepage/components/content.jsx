import React, { useState } from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { addGroupTask, selectedProjectAtom } from "../datastore";
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from "react-icons/md";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@nextui-org/react";
import Tasktable from "./tasktable";
import EditableGroupName from "./EditableGroupName";
import { dataColumns } from "./functions/hookfunctions";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  exportInitialData,
  preprocessAllData,
  preprocessData,
  renameKeys,
} from "./functions/tablefunctions";
import { SlOptionsVertical } from "react-icons/sl";
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
    const id = data._id;
    addNewGroup(id);
  };
  const exportCsv = (sub) => {
    console.log("Sub: ", sub);
    const columnData = JSON.parse(JSON.stringify(data));
    //compress all data including subitems
    const keyMapping = {};
    const colData = columnData.columns;
    columnData?.subColumns?.map((sub) => {
      colData.push(sub);
    });
    colData?.forEach((col) => {
      if (
        col.accessorKey &&
        col.accessorKey !== "item" &&
        col.accessorKey !== "id"
      ) {
        keyMapping[col.accessorKey] = col.newItemName || col.key;
      }
    });
    const finalData = exportInitialData(columnData, sub).map((row) =>
      renameKeys(row, keyMapping)
    );
    const columnHeaders = ["groupName"];
    finalData.forEach((obj) => {
      console.log(obj);
      Object.keys(obj).map((key) => {
        let num = [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ];
        if (
          !num.includes(key) &&
          key !== "groupName" &&
          !columnHeaders.includes(key)
        ) {
          columnHeaders.push(key);
        }
      });
    });
    //process data for exporting
    const preprocessedData = preprocessAllData(finalData);
    const csvConfig = mkConfig({
      fieldSeparator: ",",
      filename: columnData.name,
      decimalSeparator: ".",
      useKeysAsHeaders: false,
      quoteStrings: '"',
      showLabels: true,
      showTitle: true,
      useTextFile: false,
      useBom: true,
      showColumnHeaders: true,
      columnHeaders: columnHeaders,
    });
    if (preprocessedData.length > 0) {
      const csv = generateCsv(csvConfig)(preprocessedData);
      download(csvConfig)(csv);
      console.log("preprocessData: ", csv);
    }
  };

  return (
    <div className='p-2 flex flex-col w-full max-h-screen overflow-y-auto'>
      <div className='w-full flex '>
        <p>{data?.name}</p>
      </div>
      <div className='w-full justify-start mb-2'>
        {data !== undefined && (
          <Button onClick={() => handleAddGroup(data)}>New Group</Button>
        )}
      </div>
      <div className='w-full flex flex-col space-y-4'>
        {data?.grouptask && data?.grouptask?.length > 0 && (
          <div className='w-full'>
            <p>hello</p>
            <Dropdown>
              <DropdownTrigger>
                <Button>Download</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label='Action event example'>
                <DropdownItem key='new' onClick={() => exportCsv("noSub")}>
                  Export without SubItems
                </DropdownItem>
                <DropdownItem key='delete' onClick={() => exportCsv("Sub")}>
                  Export with SubItems
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

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
                <EditableGroupName projectId={data._id} groupData={groupData} />
              </div>
            </div>
            {groupData?.task?.length > 0 &&
              !openDrop.includes(groupData.id) && (
                <div className='w-full flex items-center justify-start pl-5'>
                  <p>{groupData?.task?.length} </p>{" "}
                  <span>
                    item
                    {groupData?.task?.length > 1 && "s"}{" "}
                  </span>
                </div>
              )}

            {openDrop.includes(groupData.id) && (
              <Tasktable
                projectId={data._id}
                groupId={groupData.id}
                groupData={groupData.task}
                columnData={dataColumns(data.columns)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Content;
