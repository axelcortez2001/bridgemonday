import { useAtom, useSetAtom } from "jotai";
import React, { useState } from "react";
import { selectedProjectAtom, updateHeaderName } from "../../datastore";
import { Input } from "@nextui-org/react";

const EditableHeader = ({ data }) => {
  const [projects, setProjects] = useAtom(selectedProjectAtom);
  const [isClicked, setIsClicked] = useState(false);
  const [newHeaderName, setNewHeaderName] = useState(data);
  const [oldName, setOldName] = useState(data);

  const editHeader = useSetAtom(updateHeaderName);
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

export default EditableHeader;
