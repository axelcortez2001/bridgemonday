import React from "react";
import { motion } from "framer-motion";

const Stepper = ({ steps, currentStep, onStepClick }) => {
  const stepVariants = {
    active: {
      borderColor: "#34D399",
      color: "#34D399",
    },
    inactive: {
      backgroundColor: "#fff",
      borderColor: "#D1D5DB",
      color: "#6B7280",
    },
  };

  const lineVariants = {
    active: { backgroundColor: "#34D399" },
    inactive: { backgroundColor: "#D1D5DB" },
  };
  console.log("Steps: ", steps);
  console.log("Current Steps ", currentStep);

  return (
    <div className='w-full border-b p-4 flex flex-row justify-center items-center gap-2'>
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          className='flex flex-row items-center cursor-pointer gap-2'
          onClick={() => onStepClick(index)}
        >
          {index !== 0 && (
            <motion.div
              className='w-20 h-1'
              initial={false}
              animate={index <= currentStep ? "active" : "inactive"}
              variants={lineVariants}
              transition={{ duration: 0.5 }}
            />
          )}
          <motion.div
            className='w-10 h-10 rounded-full border-2 flex items-center justify-center'
            initial={false}
            animate={index <= currentStep ? "active" : "inactive"}
            variants={stepVariants}
            transition={{ duration: 0.5 }}
          >
            {step.id}
          </motion.div>
          <motion.span
            className='ml-2'
            initial={false}
            animate={index <= currentStep ? "active" : "inactive"}
            variants={stepVariants}
            transition={{ duration: 0.5 }}
          >
            {step.label}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};

export default Stepper;
