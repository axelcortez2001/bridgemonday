import { Button } from "@nextui-org/react";
import React from "react";  

const SButton = ({ variant = "solid", label, icon }) => {
  return (  
    <div>
      <Button
        variant={variant}
        className="bg-a-orange text-a-white text-base font-bold"
      >
        {label}
      </Button>
    </div>
  );
};

export default SButton;
