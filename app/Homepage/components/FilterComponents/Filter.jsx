import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  cn,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  RadioGroup,
  Radio,
} from "@nextui-org/react";

import FilterColumn from "./FilterColumn";
import FilterCondition from "./FilterCondition";
import FilterValue from "./FilterValue";

const Filter = ({ data }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [columnValue, setColumnValue] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState("Select Item");
  const [condition, setCondition] = useState("Condition");
  const [value, setValue] = useState([]);
  const handleColumnValue = (col) => {
    setColumnValue(col);
  };
  const handleSelectedColumn = (col) => {
    setSelectedColumn(col);
  };
  const handleCondition = (con) => {
    setCondition(con);
  };
  const handleValue = (val) => {
    const exists = value.some((item) => item.text === val.text);

    const newValue = exists
      ? value.filter((item) => item.text !== val.text)
      : [...value, val];

    setValue(newValue);
  };

  const handleClear = () => {
    setSelectedColumn("Select Item");
    setCondition("Condition");
    setValue([]);
    setColumnValue([]);
  };
  const handleFilter = () => {
    const columnKey = columnValue.accessorKey;

    const updatedProject = {
      ...data,
      grouptask: data?.grouptask?.map((grouptask) => {
        return {
          ...grouptask,
          task: grouptask?.task?.filter((task) => {
            const taskColumnValue = task[columnKey].text.toLocaleLowerCase();
            // console.log("ColumnKey: " + columnKey);
            console.log("value: ", value);
            console.log("text value: ", taskColumnValue);
            console.log("condition: ", condition);
            // Apply filter based on the condition type
            if (condition === "is") {
              return value.some((val) =>
                taskColumnValue.includes(val.text.toLocaleLowerCase())
              ); //
            } else if (condition === "is not") {
              return !value.some((val) => taskColumnValue.includes(val));
            } else {
              return false;
            }
          }),
        };
      }),
    };

    console.log(updatedProject);
    return updatedProject;
  };

  return (
    <div>
      <button onClick={onOpen}>filter</button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Filter Data
              </ModalHeader>
              <ModalBody className='flex flex-row'>
                <div className='border rounded-md min-w-32'>
                  <FilterColumn
                    data={data}
                    setSelectedColumn={handleSelectedColumn}
                    selectedColumn={selectedColumn}
                    setColumnValue={handleColumnValue}
                  />
                </div>
                <div className='border rounded-md min-w-24 flex items-center justify-center text-sm'>
                  <FilterCondition
                    selectedColumn={selectedColumn}
                    condition={condition}
                    setCondition={handleCondition}
                    columnValue={columnValue}
                  />
                </div>
                <div className='border rounded-md w-full flex items-center justify-center text-sm'>
                  <FilterValue
                    columnValue={columnValue}
                    data={data}
                    value={value}
                    setValue={handleValue}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cancel
                </Button>
                <Button color='light' onPress={handleClear}>
                  Clear
                </Button>
                <Button color='primary' onPress={handleFilter}>
                  Filter
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Filter;
