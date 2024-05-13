"use client";
import React from "react";
import { Provider } from "jotai";
import { NextUIProvider } from "@nextui-org/react";

const Providers = ({ children }) => {
  return (
    <NextUIProvider>
      <Provider>{children}</Provider>
    </NextUIProvider>
  );
};

export default Providers;
