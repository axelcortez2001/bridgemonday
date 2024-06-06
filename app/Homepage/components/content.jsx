import React, { useState } from "react";

import { useAtom, useSetAtom } from "jotai";
import { addGroupTask, selectedProjectAtom } from "../datastore";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { Button } from "@nextui-org/react";
import Tasktable from "./tasktable";
import EditableGroupName from "./EditableGroupName";
import { dataColumns } from "./functions/hookfunctions";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  exportInitialData,
  preprocessAllData,
  renameKeys,
} from "./functions/tablefunctions";
import ProjectOption from "./otherComponents/ProjectOption";
import LoadingComponent from "./otherComponents/LoadingComponent";
const Content = () => {
  const [data, setData] = useAtom(selectedProjectAtom);
  //function to toggle dropdown of each groupTask
  const [openDrop, setOpenDrop] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const handleAddGroup = async (data) => {
    setLoading(true);
    try {
      const id = data._id;
      const status = await addNewGroup(id);
      if (status && status.success) {
        alert("New GroupTask Added");
      } else {
        alert("Error: Failed to add group task");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const exportCsv = (sub) => {
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

  return loading ? (
    <LoadingComponent />
  ) : (
    <div className=' flex flex-col w-full max-h-screen overflow-y-auto'>
      <div className='w-full p-2 flex justify-between bg-[#32449C] items-center'>
        <div className='w-full flex '>
          {data ? (
            <p className='text-white text-xl'>{data?.name}</p>
          ) : (
            <p className='text-white text-xl'>Bridge Monday</p>
          )}
        </div>

        <div className='justify-start flex gap-x-2 items-center h-full'>
          {data && data !== undefined && (
            <ProjectOption data={data} exportCsv={exportCsv} />
          )}
          {data && data !== undefined && (
            <Button
              className='bg-[#EF8B16] text-white text-md'
              onClick={() => handleAddGroup(data)}
            >
              New Group
            </Button>
          )}
        </div>
      </div>
      <div className='w-full max-w-full p-2 flex flex-col space-y-4'>
        {data?.grouptask?.map((groupData) => (
          <div
            className={`w-full hover:cursor-pointer flex flex-col items-center p-2 border rounded-md shadow-md`}
            key={groupData.id}
          >
            <div className='flex w-full justify-between items-center'>
              <div
                className={`${
                  !openDrop.includes(groupData.id)
                    ? "font-semibold"
                    : "text-xl font-bold"
                }`}
              >
                <EditableGroupName projectId={data._id} groupData={groupData} />
              </div>
              {openDrop.includes(groupData.id) ? (
                <MdKeyboardArrowUp
                  size={32}
                  onClick={() => toggleDropdown(groupData.id)}
                />
              ) : (
                <MdKeyboardArrowDown
                  size={32}
                  onClick={() => toggleDropdown(groupData.id)}
                />
              )}
            </div>
            {groupData?.task?.length > 0 &&
              !openDrop.includes(groupData.id) && (
                <div className='w-full flex items-center justify-start text-sm font-semibold'>
                  <span>
                    {groupData?.task?.length} ITEM
                    {groupData?.task?.length > 1 && "S"}{" "}
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
