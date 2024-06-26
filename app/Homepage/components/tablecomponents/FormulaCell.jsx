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
import { useAtom } from "jotai";
import { selectedProjectAtom } from "../../datastore";
import { getColforFormula } from "../functions/FormulaFunction/mainFunction";
const FormulaCell = ({ getValue, row, column, table }) => {
  const [selectedProject, setSelectedProject] = useAtom(selectedProjectAtom);
  const columnData = getColforFormula(selectedProject.columns);
  console.log("Column data: ", columnData);
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  console.log("Value: ", value);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [columnOpen, setColumnOpen] = useState(false);
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
  return (
    <div>
      <button onClick={onOpen}> {value ? value : "Select"} </button>
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
                  <Textarea
                    isRequired
                    labelPlacement='outside'
                    placeholder='Enter your formula'
                    className='w-full'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <div className='flex flex-row p-2'>
                    <div className='h-[300px] max-h-full overflow-y-auto border w-1/3 flex flex-col'>
                      <div
                        className='w-full p-2 border hover:cursor-pointer'
                        onClick={() => setColumnOpen(!columnOpen)}
                      >
                        Columns
                      </div>
                      {columnOpen && (
                        <div
                          className='flex flex-col w-full'
                          onMouseEnter={() => setHoverState("Open")}
                        >
                          <div>Column Open</div>
                        </div>
                      )}
                      <div
                        onClick={() => setFunctionOpen(!functionOpen)}
                        className='w-full p-2 border hover:cursor-pointer'
                      >
                        Functions
                      </div>
                      {functionOpen && <div>Function Open</div>}
                    </div>
                    <div className='h-[300px] max-h-full overflow-y-auto border w-full'>
                      {hoverState === "" ? (
                        <p>Select Item</p>
                      ) : (
                        <p>{hoverState}</p>
                      )}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Close
                </Button>
                <Button color='primary' onClick={() => handleSave()}>
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
