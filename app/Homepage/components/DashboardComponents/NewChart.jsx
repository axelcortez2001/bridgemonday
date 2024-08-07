import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { useSetAtom } from "jotai";
import { addChart } from "../../datastore";
import { toast } from "sonner";
import DateNewChart from "./DateNewChart";
import { VscGraph } from "react-icons/vsc";
const NewChart = ({ columndata, data }) => {
  const addNewChart = useSetAtom(addChart);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleAddChart = async (chartData) => {
    const projectId = data._id;
    const chartTitle = chartData.newItemName;
    const chartKey = chartData.accessorKey;
    const chartBased = chartData.accessorKey;
    const chartValue = [];
    const chartByDate = "byMonth";
    const filterState = "None";
    const status = await addNewChart(
      projectId,
      chartTitle,
      chartKey,
      chartBased,
      chartValue,
      chartByDate,
      filterState
    );
    if (status && status.success === true) {
      toast(status.message);
    } else {
      toast(status.message);
    }
  };
  const handleDefaultChart = async (text) => {
    const projectId = data._id;
    const chartTitle = text;
    const chartKey = text;
    const chartBased = "";
    const chartValue = [];
    const chartByDate = "byMonth";
    const filterState = "None";
    const status = await addNewChart(
      projectId,
      chartTitle,
      chartKey,
      chartBased,
      chartValue,
      chartByDate,
      filterState
    );
    if (status && status.success === true) {
      toast(status.message);
    } else {
      toast(status.message);
    }
  };
  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant="solid"
            className="bg-a-orange text-a-white text-base font-bold"
            isIconOnly
          >
            <VscGraph size={20} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu variant="faded" aria-label="Dropdown menu with icons">
          <DropdownItem
            key="groupChart"
            onClick={() => handleDefaultChart("groupChart")}
          >
            Group Chart
          </DropdownItem>
          <DropdownItem
            key="people"
            onClick={() => handleDefaultChart("people")}
          >
            People
          </DropdownItem>
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
    </>
  );
};

export default NewChart;
