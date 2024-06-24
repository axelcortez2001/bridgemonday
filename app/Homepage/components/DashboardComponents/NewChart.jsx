import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useSetAtom } from "jotai";
import { addChart } from "../../datastore";
import { toast } from "sonner";
import DateNewChart from "./DateNewChart";
const NewChart = ({ columndata, data }) => {
  const addNewChart = useSetAtom(addChart);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleAddChart = async (chartData) => {
    const projectId = data._id;
    const chartTitle = chartData.newItemName;
    const chartKey = chartData.accessorKey;
    const chartBased = chartData.accessorKey;
    const status = await addNewChart(
      projectId,
      chartTitle,
      chartKey,
      chartBased
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
    const status = await addNewChart(
      projectId,
      chartTitle,
      chartKey,
      chartBased
    );
    if (status && status.success === true) {
      toast(status.message);
    } else {
      toast(status.message);
    }
  };
  return (
    <>
      <Dropdown className=''>
        <DropdownTrigger>
          <button className='h-full   hover:bg-gray-400 flex items-center p-1 rounded-md'>
            New Chart
          </button>
        </DropdownTrigger>
        <DropdownMenu variant='faded' aria-label='Dropdown menu with icons'>
          <DropdownItem
            key='groupChart'
            onClick={() => handleDefaultChart("groupChart")}
          >
            Group Chart
          </DropdownItem>
          <DropdownItem
            key='people'
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
      <Modal
        size={"5xl"}
        isOpen={isOpen}
        onClose={onClose}
        classNames='h-[500px]'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Date Bar
              </ModalHeader>
              <ModalBody>
                <DateNewChart myData={data} />
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default NewChart;
