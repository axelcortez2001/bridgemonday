"use client";
import React from "react";
import Sidebar from "./components/sidebar";
import Content from "./components/content";

const Homepage = () => {
  return (
    <div className='flex flex-row w-full h-screen max-h-screen'>
      <Sidebar />
      <Content />
    </div>
  );
};

export default Homepage;
