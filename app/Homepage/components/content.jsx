import React, { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { addGroupTask, selectedProjectAtom } from "../datastore";
import { Button, Tabs, Tab } from "@nextui-org/react";

import EditableGroupName from "./EditableGroupName";

import { mkConfig, generateCsv, download } from "export-to-csv";
import {
  exportInitialData,
  preprocessAllData,
  renameKeys,
} from "./functions/tablefunctions";
import ProjectOption from "./otherComponents/ProjectOption";
import LoadingComponent from "./otherComponents/LoadingComponent";
import { IoAddOutline } from "react-icons/io5";
import { toast } from "sonner";
import Dashboard from "./DashboardComponents/Dashboard";
import Filter from "./FilterComponents/Filter";
import AccordionItemList from "./DashboardComponents/AccordionItemList";
import { TiTabsOutline } from "react-icons/ti";

const Content = () => {
  const [data, setData] = useAtom(selectedProjectAtom);
  //function to toggle dropdown of each groupTask
  const [loading, setLoading] = useState(false);

  //filtering function
  console.log("Main Data: ", data);

  //Handlers
  //handler to add new group
  const addNewGroup = useSetAtom(addGroupTask);
  const handleAddGroup = async (data) => {
    setLoading(true);
    try {
      const id = data._id;
      const status = await addNewGroup(id);
      if (status && status.success) {
        toast(status.message);
      } else {
        toast(status.message);
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
    console.log(preprocessedData);
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
    }
  };

  return loading ? (
    <LoadingComponent />
  ) : (
    <div className="flex flex-col w-full max-h-screen overflow-y-hidden md:pl-[300px] bg-a-grey">
      <div className="w-full p-2 flex max-h-[56px] justify-between bg-a-blue items-center">
        <div className="flex ml-[44px] md:ml-[0px] w-[60%]">
          {data ? (
            <p className="text-white text-base font-bold leading-none">
              {data?.name}
            </p>
          ) : (
            <p className="text-white text-base font-bold leading-none">
              Bridge Workspace
            </p>
          )}
        </div>

        <div className="justify-start flex gap-x-2 items-center h-full">
          {data && data !== undefined && (
            <ProjectOption data={data} exportCsv={exportCsv} />
          )}
          <div className="hidden xs:block">
            {data && data !== undefined && (
              <Button
                className="bg-a-orange text-white text-base font-medium"
                size="sm"
                onClick={() => handleAddGroup(data)}
              >
                New Group
              </Button>
            )}
          </div>
          <div className="block xs:hidden">
            {data && data !== undefined && (
              <Button
                className="bg-a-orange text-white text-base"
                size="sm"
                isIconOnly
                onClick={() => handleAddGroup(data)}
              >
                <IoAddOutline className="size-[70%]" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <Tabs
        aria-label="Tabs"
        variant="light"
        classNames={{
          base: "m-2 mt-4",
          tabList: "gap-4 w-full ",
          tab: "bg-a-darkgrey border-b-2 border-a-black",
          tabContent:
            "group-data-[selected=true]:text-a-blue hover:text-a-blue text-a-black text-base ",
          panel: "overflow-y-auto",
        }}
      >
        <Tab key="Table" title="Table" className="text-base p-0">
          <div className="w-full max-w-full p-[4px] md:p-[8px] space-y-2 md:space-y-2 flex flex-col mt-1 md:mt-0">
            {data?.grouptask?.map((groupData, index) => (
              <AccordionItemList
                key={index}
                setKey={index}
                data={data}
                groupData={groupData}
              />
            ))}
          </div>
        </Tab>
        <Tab key="Dashboard" title="Dashboard" className="">
          <Dashboard myData={data} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default Content;
