import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import Stepper from "../../sidebarcomponents/Stepper";
import Upload from "../../sidebarcomponents/Upload";
import MatchGroupColumns from "./MatchGroupColumns";
import { useSetAtom } from "jotai";
import { importGroupProject } from "@/app/Homepage/datastore";
import { toast } from "sonner";

const steps = [
  { id: 1, label: "Upload" },
  { id: 2, label: "Match Columns" },
  { id: 3, label: "Validate" },
];
const ImportGroupOption = ({ onClose, data }) => {
  const [posIndex, setPosIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  //UploadedFIle
  const [uploadedFile, setUploadedFile] = useState([]);
  //newWorkSpaceData
  const [newGroupData, setNewGroupData] = useState(null);
  //upload handler
  const handleUploadFile = (a) => {
    setUploadedFile(a);
    if (a.length > 0) {
      handleNext();
    }
  };
  const handleNext = () => {
    setDirection("next");
    setPosIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setDirection("prev");
    setPosIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (index) => {
    setDirection(index > posIndex ? "next" : "prev");
    setPosIndex(index);
  };
  const handleGroupData = (workspace) => {
    setNewGroupData(workspace);
    if (workspace !== null) {
      handleNext();
    }
  };
  const importGroupData = useSetAtom(importGroupProject);
  const handleSaveGroupData = async () => {
    if (newGroupData !== null) {
      const projectId = data._id;
      const status = await importGroupData(projectId, newGroupData);
      if (status && status.success) {
        toast(status.message);
      } else {
        toast(status.message);
      }
    } else {
      toast.error("GroupProject missing");
    }
  };
  return (
    <>
      <ModalHeader className='flex flex-col gap-1'>Import File</ModalHeader>
      <ModalBody>
        <div className='w-full flex flex-col border rounded-md h-full'>
          <Stepper
            steps={steps}
            currentStep={posIndex}
            direction={direction}
            onStepClick={handleStepClick}
          />
          {posIndex === 0 ? (
            <Upload
              uploadedFile={uploadedFile}
              setUploadedFile={handleUploadFile}
            />
          ) : (
            posIndex === 1 && (
              <MatchGroupColumns
                data={data}
                uploadedFile={uploadedFile}
                setNewGroupData={handleGroupData}
              />
            )
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color='danger' variant='light' onPress={onClose}>
          Close
        </Button>
        {posIndex > 0 && (
          <Button color='primary' onPress={handlePrevious}>
            Previous
          </Button>
        )}
        {posIndex < steps.length - 1 && (
          <Button color='primary' onPress={handleNext}>
            Next
          </Button>
        )}
        {posIndex === steps.length - 1 && (
          <Button
            color='primary'
            onPress={onClose}
            onClick={() => handleSaveGroupData()}
          >
            Import
          </Button>
        )}
      </ModalFooter>
    </>
  );
};

export default ImportGroupOption;
