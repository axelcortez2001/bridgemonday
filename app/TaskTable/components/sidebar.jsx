import React, { useState } from "react";
import { projectsAtom, selectedProject } from "../taskstore";
import { useAtom, useSetAtom } from "jotai";
const Sidebar = () => {
  const [data, setData] = useAtom(projectsAtom);
  const setSelectedData = useSetAtom(selectedProject);
  console.log(data);
  return (
    <div className='w-60 min-w-60 h-screen flex flex-col border border-gray-900'>
      <div className='w-full p-2'>Home</div>
      <div className='w-full p-2'>My Work</div>
      <div className='w-full h-5 p-2 border-b-1'></div>
      <div className='w-full flex flex-col'>
        {data.map((task) => (
          <div
            className='w-full p-2 hover:bg-gray-200 hover:cursor-pointer'
            key={task.id}
            onClick={() => setSelectedData(task.id)}
          >
            {task.projectTitle}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
