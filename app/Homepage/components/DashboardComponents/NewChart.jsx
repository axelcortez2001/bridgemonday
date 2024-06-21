import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { useSetAtom } from "jotai";
import { addChart } from "../../datastore";
const NewChart = ({ columndata, data }) => {
  const addNewChart = useSetAtom(addChart);
  const handleAddChart = async (chartData) => {
    const projectId = data._id;
    const chartTitle = chartData.newItemName;
    const chartKey = chartData.accessorKey;
    const status = await addNewChart(projectId, chartTitle, chartKey);
  };
  return (
    <Dropdown className=''>
      <DropdownTrigger>
        <button className='h-full   hover:bg-gray-400 flex items-center p-1 rounded-md'>
          New Chart
        </button>
      </DropdownTrigger>
      <DropdownMenu variant='faded' aria-label='Dropdown menu with icons'>
        {columndata &&
          columndata?.map((column) => (
            <DropdownItem
              key={column.newItemName}
              onClick={() => handleAddChart(column)}
            >
              {column.newItemName}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default NewChart;
