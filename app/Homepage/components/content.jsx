import React, { useState } from "react";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  addGroupTask,
  sampleData,
  sampleUser,
  selectedProjectAtom,
} from "../datastore";
import { IoIosArrowDropdown } from "react-icons/io";
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from "react-icons/md";
import { Button } from "@nextui-org/react";
import Tasktable from "./tasktable";
import EditableGroupName from "./EditableGroupName";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { dataColumns } from "./functions/hookfunctions";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { preprocessAllData, preprocessData } from "./functions/tablefunctions";
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
  const exportCsv = () => {
    const columnData = JSON.parse(JSON.stringify(data));
    console.log("Data:", columnData);
    const exportInitialData = () => {
      let finalData = [];
      if (columnData?.grouptask) {
        columnData.grouptask.map((group) => {
          group?.task.map((task) => {
            finalData.push({ ...task, groupName: group.groupName });
            task?.subItems?.map((sub) => {
              const { id, item, ...rest } = sub;
              finalData.push({
                SubId: sub.id,
                SubName: sub.item,
                groupName: group.groupName,
                ...rest,
              });
            });
          });

          finalData.push(group.groupName);
        });
      }
      return finalData;
    };
    const keyMapping = {};
    const colData = columnData.columns;
    columnData?.subColumns?.map((sub) => {
      colData.push(sub);
    });
    console.log("Cols:", colData);
    colData?.forEach((col) => {
      if (
        col.accessorKey &&
        col.accessorKey !== "item" &&
        col.accessorKey !== "id"
      ) {
        keyMapping[col.accessorKey] = col.newItemName || col.key;
      }
    });
    const renameKeys = (obj, keyMap) => {
      if (obj instanceof Object) {
        return Object.keys(obj).reduce((acc, key) => {
          const newKey = keyMap[key] || key;
          acc[newKey] = obj[key];
          return acc;
        }, {});
      } else {
        return obj;
      }
    };

    const finalData = exportInitialData().map((row) =>
      renameKeys(row, keyMapping)
    );
    const columnHeaders = ["groupName"];
    finalData.forEach((obj) => {
      console.log(obj);
      Object.keys(obj).map((key) => {
        let num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        if (
          !num.includes(key) &&
          key !== "groupName" &&
          !columnHeaders.includes(key)
        ) {
          columnHeaders.push(key);
        }
      });
    });

    console.log("KeyMapping: ", columnHeaders);
    const preprocessedData = preprocessAllData(finalData);
    console.log("preprocessData11: ", preprocessedData);
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
        {data?.grouptask && data.grouptask.length > 0 && (
          <div>
            <Button onClick={() => exportCsv()}>Download</Button>
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
