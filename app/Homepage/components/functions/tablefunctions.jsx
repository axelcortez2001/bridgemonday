import { flexRender } from "@tanstack/react-table";
// needed for row & cell level scope DnD setup

import { Button } from "@nextui-org/react";
import SubItemTable from "../SubItemTable";
import { useAtom, useSetAtom } from "jotai";
import { selectedProjectAtom, updateSubItemData } from "../../datastore";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

//functions for DnD based from tanstackDnD
//Cell Component
export const RowDragHandleCell = ({ rowId }) => {
  const { attributes, listeners } = useSortable({ id: rowId });
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button
      {...attributes}
      {...listeners}
      className=' h-10 w-1  hover:w-2 hover:bg-a-blue ease-in duration-200'
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
  const projectId = project._id;
  const groupId = gId;
  const [data, setData] = useState(subData);
  const handleData = (newData) => {
    setData(newData);
  };
  const handleAdd = async () => {
    console.log(data);
    const status = await addSubColumn(projectId, groupId, taskId, data);
    if (status && status.success === true) {
      setData(status.task);
    } else {
      alert("Error adding task");
    }
  };
  console.log("subDataaa: " + JSON.stringify(subData));
  return (
    <>
      <tr ref={setNodeRef} style={style}>
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            style={{ width: cell.column.getSize() }}
            className={`${
              row.getIsSelected() ? "bg-gray-200" : "border-b"
            } py-[4px]`}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
      {row.getIsExpanded() && (
        <>
          <tr>
            <td colSpan={row.getVisibleCells().length}>
              <div className='w-full ml-14 border-l-1 pl-[8px]'>
                <Button
                  size='sm'
                  className='mt-[8px] font-[12px] bg-a-blue text-white font-helvetica'
                  onClick={() => handleAdd()}
                >
                  Add SubItem
                </Button>
              </div>
            </td>
          </tr>
          <tr className=''>
            {/* 2nd row is a custom 1 cell row */}
            <td colSpan={row.getVisibleCells().length}>
              <SubItemRow
                subItems={data}
                groupId={groupId}
                taskId={taskId}
                setData={handleData}
              />
            </td>
          </tr>
        </>
      )}
    </>
  );
};
export const SubItemRow = ({
  subItems,
  groupId,
  taskId,
  setData,
  subColumns,
}) => (
  <div className='pl-14'>
    {subItems !== undefined && subItems.length > 0 && (
      <SubItemTable
        subItems={subItems}
        groupId={groupId}
        taskId={taskId}
        setData={setData}
      />
    )}
  </div>
);
const removeSubItems = (data) => {
  return data.map((row) => {
    console.log(row instanceof Object);
    if (row instanceof Object) {
      const { subItems, ...rest } = row;
      return rest;
    } else {
      return row;
    }
  });
};
export const preprocessData = (data, convertedArray) => {
  const data1 = removeSubItems(data);
  const array = convertedArray;
  const selectedExport = data1.filter((rowData) =>
    array.some((row) => row === rowData.id)
  );
  return selectedExport.map((row) => {
    const processedRow = {};
    for (const key in row) {
      const value = row[key];
      if (Array.isArray(value) || typeof value === "object") {
        if (value && value.length > 0) {
          const returnedValue = value.map((val) => {
            return val.email;
          });
          processedRow[key] = JSON.stringify(returnedValue);
        } else if (value && value.text !== undefined) {
          processedRow[key] = value.text;
        } else processedRow[key] = JSON.stringify(value);
      } else {
        processedRow[key] = value;
      }
    }
    return processedRow;
  });
};

export const preprocessAllData = (data) => {
  const data1 = data;
  return data1.map((row) => {
    if (row instanceof Object) {
      const processedRow = {};
      for (const key in row) {
        const value = row[key];
        if (Array.isArray(value) || typeof value === "object") {
          if (key === "subItems") {
            const returnedValue = value.map((val) => {
              return val.item;
            });
            processedRow[key] = JSON.stringify(returnedValue);
          } else if (value && value.length > 0) {
            const returnedValue = value.map((val) => {
              return val.email;
            });
            processedRow[key] = JSON.stringify(returnedValue);
          } else if (value && value.text !== undefined) {
            processedRow[key] = value.text;
          } else processedRow[key] = JSON.stringify(value);
        } else {
          processedRow[key] = value;
        }
      }
      return processedRow;
    } else {
      return [row];
    }
  });
};

export const renameKeys = (obj, keyMap) => {
  if (obj instanceof Object) {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = keyMap[key] || key;
      acc[newKey] = obj[key];
      return acc;
    }, {});
  } else {
    return obj;
  }
};

export const exportInitialData = (columnData, sub) => {
  let finalData = [];
  if (columnData?.grouptask) {
    columnData.grouptask.map((group) => {
      group?.task.map((task) => {
        finalData.push({ ...task, groupName: group.groupName });
        if (sub === "Sub") {
          task?.subItems?.map((sub) => {
            const { id, item, ...rest } = sub;
            finalData.push({
              SubId: sub.id,
              SubName: sub.item,
              groupName: group.groupName,
              ...rest,
            });
          });
        }
      });

      finalData.push(group.groupName);
    });
  }
  return finalData;
};
