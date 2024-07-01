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
} from "../functions/FormulaFunction/mainFunction";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import FunctionOption from "../otherComponents/FormulaComponent/FunctionOption";
import ColumnSelected from "../otherComponents/FormulaComponent/ColumnSelected";
import FormulaContent from "../otherComponents/FormulaComponent/FormulaContent";
import FormulaExtension from "../otherComponents/FormulaComponent/FormulaExtension";
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
  const [columnOpen, setColumnOpen] = useState(false);
  const [extension, setExtension] = useState(value?.formula || "");
  const [functionOpen, setFunctionOpen] = useState(false);
  const [hoverState, setHoverState] = useState("");
  const handleSave = () => {
    table.options.meta?.updateData(row.index, column.id, value);
    onClose();
  };
  console.log("Initial ValueL ", initialValue);
  console.log("Ivalue ", value);
  useEffect(() => {
    console.log("trihher");
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
    const formula = `${extension}`;
    const newValue = {
      operation,
      column,
      formula,
    };
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
  const handleShownValue = (val) => {
    if (val !== undefined) {
      switch (val?.operation) {
        case "IF":
          const id = row.original.id;
          const task = row.original;
          const finalValue = getFormulaValue(
            id,
            task,
            val?.column,
            val?.formula
          );
          console.log("FinalValue: ", finalValue);
          return finalValue?.value;
        case "SUM":
          return `SUM(${getValue()})`;
        case "AVERAGE":
          return `AVERAGE(${getValue()})`;
        case "MAX":
          return `MAX(${getValue()})`;
        case "MIN":
          return `MIN(${getValue()})`;
        case "COUNT":
          return `COUNT(${getValue()})`;
        default:
          return "No Value";
      }
    } else {
      return "No Value";
    }
  };
  return (
    <div>
      <button onClick={onOpen}> {handleShownValue(value)} </button>
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
                <div className='flex flex-col w-full h-[400px]'>
                  <div className='flex flex-row p-2'>
                    <FunctionOption
                      chosenFunction={chosenFunction}
                      setChosenFunction={handleChosenFunction}
                    />
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
                  </div>
                  <FormulaContent
                    columnData={columnData}
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
