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
import FunctionOption from "../otherComponents/FormulaComponent/FunctionOption";
import { useAtom, useSetAtom } from "jotai";
import { selectedProjectAtom, updateFormula } from "../../datastore";
import {
  getColforFormula,
  handleShownValue,
} from "../functions/FormulaFunction/mainFunction";
import ColumnSelected from "../otherComponents/FormulaComponent/ColumnSelected";
import FormulaExtension from "../otherComponents/FormulaComponent/FormulaExtension";
import FormulaContent from "../otherComponents/FormulaComponent/FormulaContent";
import Equations from "../otherComponents/FormulaComponent/Equations";
const SubFormulaCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);
  const columnData = getColforFormula(selectedProject.subColumns);
  const [columnArray, setColumnArray] = useState(value?.columnArray || []);
  const [extension, setExtension] = useState(value?.formula || "");
  const task = row.original;
  const key = column.id;
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [chosenFunction, setChosenFunction] = useState(
    value?.operation || "None"
  );
  const [chosenColumn, setChosenColumn] = useState(value?.column || null);
  //Handlers
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
    const type = "Sub";
    setValue(newValue);
    setNewFormula(projectId, key, newValue, type);
    onClose();
  };

  return (
    <div className='w-full text-center min-h-7 hover:bg-gray-200 rounded-md'>
      <button onClick={onOpen}>
        {" "}
        {Array?.isArray(handleShownValue(value, task)) ? (
          <div className='flex flex-wrap'>
            {handleShownValue(value, task)?.map((val, index) => (
              <div key={index}>
                {val}
                {"  |  "}
              </div>
            ))}
          </div>
        ) : handleShownValue(value, task) === "" ? (
          <p>No Value</p>
        ) : (
          handleShownValue(value, task)
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
                    ) : chosenFunction !== "None" ? (
                      <Equations
                        chosenFunction={chosenFunction}
                        columnData={columnData}
                        columnArray={columnArray}
                        setColumnArray={handleColumnArray}
                      />
                    ) : (
                      <p>Select a function</p>
                    )}
                  </div>
                  <FormulaContent
                    type='Sub'
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

export default SubFormulaCell;
