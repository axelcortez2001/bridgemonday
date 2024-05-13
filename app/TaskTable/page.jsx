"use client";
import React from "react";
import Sidebar from "./components/sidebar";
import Task from "./components/task";

const TaskTable = () => {
  return (
    <div className='w-full h-screen flex flex-row'>
      <Sidebar />
      <Task />
    </div>
  );
};

export default TaskTable;
