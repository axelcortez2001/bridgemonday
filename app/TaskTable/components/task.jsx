import { useAtom, useAtomValue } from "jotai";
import { projectsAtom, selectedProjectDataAtom } from "../taskstore";
import React, { useState } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import Maintable from "./maintable";
import Mainpage from "@/app/Mainpage/page";

const Task = () => {
  const [selectedProject, setSelectedProject] = useAtom(
    selectedProjectDataAtom
  );
  const [pendingDown, setPendingDown] = useState(false);
  return (
    <div className='p-2 flex flex-col w-full'>
      <p>{selectedProject.projectTitle}</p>
      <div className='w-full'>
        <div
          onClick={() => setPendingDown(!pendingDown)}
          className={`w-full  ${
            !pendingDown ? "bg-gray-200 border" : ""
          } hover:cursor-pointer flex items-center p-2`}
        >
          {pendingDown ? <IoIosArrowDropdown /> : "<"}
          Pending
        </div>
        {pendingDown && (
          <div className='p-2'>
            <Maintable tableData={selectedProject.pending} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
