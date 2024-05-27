import { flexRender } from "@tanstack/react-table";
// needed for row & cell level scope DnD setup
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@nextui-org/react";
import SubItemTable from "../SubItemTable";
import { useAtom, useSetAtom } from "jotai";
import { selectedProjectAtom, updateSubItemData } from "../../datastore";
import { useState } from "react";
import { dataColumns } from "./hookfunctions";

//functions for DnD based from tanstackDnD
//Cell Component
export const RowDragHandleCell = ({ rowId }) => {
  const { attributes, listeners } = useSortable({ id: rowId });
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button
      {...attributes}
      {...listeners}
      className=' h-10 w-1  hover:w-2 hover:bg-gray-400'
    ></button>
  );
};

//Row Component
export const DraggableRow = ({ row, gId }) => {
  const [project, setProject] = useAtom(selectedProjectAtom);
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform), // let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };
  //function to add subcolumn
  const addSubColumn = useSetAtom(updateSubItemData);
  const subData = row?.original?.subItems || [];
  const taskId = row.original.id;
  const projectId = project.id;
  const groupId = gId;
  const [data, setData] = useState(subData);
  const handleAdd = () => {
    const project = addSubColumn(projectId, groupId, taskId, data);
    setData(project);
  };
  console.log("ROW: " + row);
  return (
    <>
      <tr ref={setNodeRef} style={style}>
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            style={{ width: cell.column.getSize() }}
            className={row.getIsSelected() ? "bg-gray-200" : ""}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
      {row.getIsExpanded() && (
        <>
          <tr className=' '>
            <td colSpan={row.getVisibleCells().length}>
              <div className='w-full pl-14'>
                <Button onClick={() => handleAdd()}>Add SubItem</Button>
              </div>
            </td>
          </tr>
          <tr className=''>
            {/* 2nd row is a custom 1 cell row */}
            <td colSpan={row.getVisibleCells().length}>
              <SubItemRow
                subItems={dataColumns(data)}
                groupId={groupId}
                taskId={taskId}
              />
            </td>
          </tr>
        </>
      )}
    </>
  );
};
export const SubItemRow = ({ subItems, groupId, taskId }) => (
  <div className='pl-14'>
    {console.log("SubItems: ", subItems)}
    {subItems !== undefined && (
      <SubItemTable subItems={subItems} groupId={groupId} taskId={taskId} />
    )}

    {/* {subItems?.map((subItem) => (
      <div key={subItem.id} className='p-2 border border-gray-300'>
        {subItem.id}
      </div>
    ))} */}
  </div>
);
