"use client";
import React, { useState } from "react";
import {
  Input,
  Skeleton,
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
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { deleteChart, renameChart, updateChartType } from "../../datastore";
import { SlOptionsVertical } from "react-icons/sl";
import ChartSetting from "./ChartSetting";
import SettingChartComponent from "./SettingChartComponent";
import SettingChartOption from "./SettingChartOption";

const EditableChartName = ({ chart, data }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [newName, setNewName] = useState(chart.title);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chartSetting, setChartSetting] = useState(chart);
  //setting chart
  const handleChartSetting = (newChart) => {
    setChartSetting(newChart);
  };
  const rename = useSetAtom(renameChart);
  const handleBlur = async () => {
    setLoading(true);
    try {
      if (newName === "") {
        toast("Chart name cannot be empty");
      } else if (newName === chart.title) {
        setIsClicked(false);
      } else {
        const projectId = data._id;
        const chartId = chart.id;
        const status = await rename(projectId, chartId, newName);
        if (status && status.success === false) {
          toast(status.message);
        }
      }
      setIsClicked(false);
    } catch (error) {
      setIsClicked(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  //delete chart
  const delChart = useSetAtom(deleteChart);
  const handleDeleteChart = async (chart) => {
    if (window.confirm("Are you sure you want to delete this chart")) {
      const projectId = data._id;
      const chartId = chart.id;
      const status = await delChart(projectId, chartId);
      if (status && status.success) {
        toast(status.message);
      } else {
        toast(status.message);
      }
    }
  };
  //update chart type
  const chartType = useSetAtom(updateChartType);
  const handleUpdateChartType = async () => {
    try {
      const projectId = data._id;
      const chartId = chart.id;
      const status = await chartType(projectId, chartId, chartSetting);
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };
  return (
    <div className='w-full flex justify-between'>
      <div className='hover:cursor-text'>
        {loading ? (
          <div className='text-a-grey font-light text-sm w-full'>
            <Skeleton className='rounded-lg w-full h-[32px] my-[4px]'></Skeleton>
          </div>
        ) : !isClicked ? (
          <p onClick={() => setIsClicked(true)}>{chart.title}</p>
        ) : (
          <Input
            placeholder='Title'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            onBlur={handleBlur}
          ></Input>
        )}
      </div>
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
        <DropdownMenu variant='faded' aria-label='Chart Option'>
          <DropdownItem>Full Screen</DropdownItem>
          <DropdownItem onClick={onOpen}>Settings</DropdownItem>
          <DropdownItem onClick={() => setIsClicked(true)}>Rename</DropdownItem>
          <DropdownItem onClick={() => handleDeleteChart(chart)}>
            Delete
          </DropdownItem>
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
                {chart.title}
              </ModalHeader>
              <ModalBody>
                <div className='w-full flex flex-row p-2 gap-4'>
                  <div
                    className={`border h-auto  ${
                      chart.type === "bar" || chart.type === "line"
                        ? "w-[700px]"
                        : "w-[600px]"
                    } bg-white rounded-xl`}
                  >
                    <SettingChartComponent chart={chartSetting} />
                  </div>
                  <SettingChartOption
                    chart={chartSetting}
                    setChartSetting={handleChartSetting}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='light'
                  onPress={onClose}
                  onClick={() => setChartSetting(chart)}
                >
                  Close
                </Button>
                <Button color='primary' onClick={() => handleUpdateChartType()}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditableChartName;
