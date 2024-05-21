import React, { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { selectedProjectAtom, updateSubHeaderName } from "../../datastore";
import { Input } from "@nextui-org/react";

const EditableSubHeader = ({ data }) => {
  const [projects, setProjects] = useAtom(selectedProjectAtom);
  const [isClicked, setIsClicked] = useState(false);
  const [newHeaderName, setNewHeaderName] = useState(data);
  const [oldName, setOldName] = useState(data);
  const editHeader = useSetAtom(updateSubHeaderName);
  const projectId = projects.id;
  const handleBlur = () => {
    editHeader(projectId, oldName, newHeaderName);
    setIsClicked(false);
  };

  return (
    <div className='hover:cursor-text'>
      {!isClicked ? (
        <p onClick={() => setIsClicked(true)}>{data}</p>
      ) : (
        <Input
          placeholder='Title'
          value={newHeaderName}
          onChange={(e) => setNewHeaderName(e.target.value)}
          required
          onBlur={handleBlur}
        ></Input>
      )}
    </div>
  );
};

export default EditableSubHeader;
