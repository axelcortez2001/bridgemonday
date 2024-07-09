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
import Stepper from "./Stepper";
import Upload from "./Upload";
import MatchColumns from "./MatchColumns";
import Validate from "./Validate";

const steps = [
  { id: 1, label: "Upload" },
  { id: 2, label: "Match Columns" },
  { id: 3, label: "Validate" },
];

const ImportOption = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [posIndex, setPosIndex] = useState(0);
  const [direction, setDirection] = useState("next");

  //UploadedFIle
  const [uploadedFile, setUploadedFile] = useState([]);
  //upload handler
  const handleUploadFile = (a) => {
    console.log(a);
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

  return (
    <>
      <Button color='secondary' onClick={onOpen}>
        Import File
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size='5xl'
        className='h-[90%]'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                Import File
              </ModalHeader>
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
                  ) : posIndex === 1 ? (
                    <MatchColumns uploadedFile={uploadedFile} />
                  ) : (
                    <Validate />
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
                  <Button color='primary' onPress={onClose}>
                    Import
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImportOption;
