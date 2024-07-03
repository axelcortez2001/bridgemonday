import React, { useState, useEffect } from "react";
import {
  Textarea,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useAtom, useSetAtom } from "jotai";
import { selectedProjectAtom, updateFormula } from "../../datastore";
import {
  getColforFormula,
  getFormulaValue,
  getSumValue,
} from "../functions/FormulaFunction/mainFunction";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import FunctionOption from "../otherComponents/FormulaComponent/FunctionOption";
import ColumnSelected from "../otherComponents/FormulaComponent/ColumnSelected";
import FormulaContent from "../otherComponents/FormulaComponent/FormulaContent";
import FormulaExtension from "../otherComponents/FormulaComponent/FormulaExtension";
import Equations from "../otherComponents/FormulaComponent/Equations";
const FormulaCell = ({ getValue, row, column, table }) => {
  const key = column.id;
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);
  const columnData = getColforFormula(selectedProject.columns);
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [chosenFunction, setChosenFunction] = useState(
    value?.operation || "None"
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chosenColumn, setChosenColumn] = useState(value?.column || null);
  const [columnArray, setColumnArray] = useState(value?.columnArray || []);
  const [columnOpen, setColumnOpen] = useState(false);
  const [extension, setExtension] = useState(value?.formula || "");
  const [functionOpen, setFunctionOpen] = useState(false);
  const [hoverState, setHoverState] = useState("");
  const handleSave = () => {
    table.options.meta?.updateData(row.index, column.id, value);
    onClose();
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  useEffect(() => {
    if (columnOpen === false) {
      setHoverState("");
    }
  }, [columnOpen]);
  const hoverChange = (hoverdata) => {
    setHoverState(hoverdata);
  };
  //handlers for childrens
  const setNewFormula = useSetAtom(updateFormula);

  const handleValue = () => {
    const operation = chosenFunction;
    const column = chosenColumn;
    const colArray = columnArray;
    const formula = `${extension}`;
    let newValue = {};
    if (operation === "IF") {
      newValue = {
        operation,
        column,
        formula,
      };
    } else {
      newValue = {
        operation,
        columnArray,
      };
    }

    const projectId = selectedProject._id;
    setValue(newValue);
    setNewFormula(projectId, key, newValue);
    onClose();
  };
  const handleChosenFunction = (a) => {
    setChosenFunction(a);
  };
  const handleChosenColumn = (a) => {
    setChosenColumn(a);
  };
  const handleExtension = (a) => {
    setExtension(`${extension} ${a}`);
  };
  const handleFullExtension = (a) => {
    setExtension(a);
  };
  const handleColumnArray = (a) => {
    const exists = columnArray.some(
      (item) => item.accessorKey === a.accessorKey
    );
    const newValue = exists
      ? columnArray.filter((item) => item.accessorKey !== a.accessorKey)
      : [...columnArray, a];
    setColumnArray(newValue);
  };
  const handleShownValue = (val) => {
    if (val !== undefined) {
      const id = row.original.id;
      const task = row.original;
      switch (val?.operation) {
        case "IF":
          const finalValue = getFormulaValue(
            id,
            task,
            val?.column,
            val?.formula
          );
          return finalValue?.value;
        case "SUM":
        case "DIFFERENCE":
        case "PRODUCT":
        case "QUOTIENT":
        case "AVERAGE":
        case "MAX":
        case "MIN":
        case "MEAN":
        case "MEDIAN":
        case "MODE":
          const SumValue = getSumValue(
            id,
            task,
            val?.operation,
            val?.columnArray
          );
          return SumValue?.value;

        default:
          return "No Value";
      }
    } else {
      return "No Value";
    }
  };
  return (
    <div className='w-full text-center min-h-7 hover:bg-gray-200 rounded-md'>
      <button onClick={onOpen}>
        {Array?.isArray(handleShownValue(value)) ? (
          <div className='flex flex-wrap'>
            {handleShownValue(value)?.map((val, index) => (
              <div key={index}>
                {val}
                {"  |  "}
              </div>
            ))}
          </div>
        ) : handleShownValue(value) === "" ? (
          <p>No Value</p>
        ) : (
          handleShownValue(value)
        )}{" "}
      </button>
      <Modal
        size={"3xl"}
        isOpen={isOpen}
        onClose={onClose}
        classNames='h-[500px] overflow-y-auto'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Formula</ModalHeader>
              <ModalBody>
                <div className='flex flex-col w-full max-h-[400px]'>
                  <div className='flex flex-row p-2'>
                    <FunctionOption
                      chosenFunction={chosenFunction}
                      setChosenFunction={handleChosenFunction}
                    />
                    {chosenFunction && chosenFunction === "IF" ? (
                      <>
                        <ColumnSelected
                          columnData={columnData}
                          chosenColumn={chosenColumn}
                          setChosenColumn={handleChosenColumn}
                        />
                        <FormulaExtension
                          extension={extension}
                          setExtension={handleExtension}
                          setFullExtension={handleFullExtension}
                        />
                      </>
                    ) : (
                      <Equations
                        chosenFunction={chosenFunction}
                        columnData={columnData}
                        columnArray={columnArray}
                        setColumnArray={handleColumnArray}
                      />
                    )}
                  </div>
                  <FormulaContent
                    columnData={columnData}
                    columnArray={columnArray}
                    chosenFunction={chosenFunction}
                    chosenColumn={chosenColumn}
                    selectedProject={selectedProject}
                    extension={extension}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onClick={() => handleValue()}>
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

export default FormulaCell;
