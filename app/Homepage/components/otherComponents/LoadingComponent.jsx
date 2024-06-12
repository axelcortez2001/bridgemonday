import React from "react";
import { Spinner } from "@nextui-org/react";

const LoadingComponent = () => {
  return (
    <div className='absolute top-0 right-0 w-full h-screen flex items-center justify-center bg-white bg-opacity-50'>
      <Spinner>Loading...</Spinner>;
    </div>
  );
};

export default LoadingComponent;