import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom, useSetAtom } from "jotai";
import { selectedProjectAtom, updateGroupData } from "../datastore";
// needed for table body level scope DnD setup
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableRow, preprocessData } from "./functions/tablefunctions";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { dataColumns } from "./functions/hookfunctions";
import styles from "@/app/styles";
import { Button } from "@nextui-org/react";
import { MdOutlineDelete } from "react-icons/md";
import { CiExport } from "react-icons/ci";
import { toast } from "sonner";
import TableFooter from "./tablecomponents/TableFooter";

const Tasktable = ({ projectId, groupId, groupData, columnData }) => {
  const [projects, setProjects] = useAtom(selectedProjectAtom);
  const [selectedRows, setSelectedRows] = useState([]);
  const [columns, setColumns] = useState(columnData);
  const [data, setData] = useState(groupData);
  const [initialColumns, setInitialColumns] = useState(projects.columns);
  useEffect(() => {
    if (JSON.stringify(projects.columns) !== JSON.stringify(initialColumns)) {
      setInitialColumns(projects.columns);
      setColumns(columnData);
    }
  }, [columnData]);
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(groupData)) {
      setData(groupData);
    }
  }, [groupData]);
  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      selectedRows,
    },
    columnResizeMode: "onChange",
    getRowId: (row) => row.id,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    enableColumnResizing: true,
    getRowCanExpand: () => true,
    getExpandedRowModel: getExpandedRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row
          )
        ),
    },
  });
  //update the all table data of an specfic table
  const updateTableData = useSetAtom(updateGroupData);
  useEffect(() => {
    const updateData = async () => {
      try {
        const type = "UpdateData";
        if (JSON.stringify(data) !== JSON.stringify(groupData)) {
          console.log("Trigger");
          const status = await updateTableData(projectId, groupId, data, type);
          if (status && status.success === false) {
            if (status.newTask) {
              setData(status.newTask);
            } else {
              toast("Error updating");
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    updateData();
  }, [updateTableData, data]);

  //function to delete a row or whole table row
  const convertToArray = () => {
    return Object.keys(table.getState().rowSelection).map(Number);
  };
  const deleteSelectedRows = () => {
    if (window.confirm("Are you sure you want to delete") === true) {
      const selectedRowIds = convertToArray();
      const newData = data.filter(
        (row, index) => !selectedRowIds.includes(row.id)
      );
      setData(newData);
      table.reset();
    }
  };
  //add new tablerow to an specific table
  const addNewRow = async () => {
    try {
      const type = "Add Row";
      const status = await updateTableData(projectId, groupId, data, type);
      if (status && status.success === true) {
        setData(status?.task);
      } else {
        if (status.newTask) {
          setData(status.newTask);
        } else {
          toast("Error adding task!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const dataIds = React.useMemo(() => data?.map(({ id }) => id), [data]);
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  //exportfunction
  const csvConfig = mkConfig({
    fieldSeparator: ",",
    filename: "table_data",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
    quoteStrings: '"',
    showLabels: true,
    showTitle: false,
    useTextFile: false,
    useBom: true,
  });
  const exportCsv = () => {
    const rowData = table.getRowModel().rows.map((row) => row.original);
    const keyMapping = {};
    columnData.forEach((col) => {
      if (
        col.accessorKey &&
        col.accessorKey !== "item" &&
        col.accessorKey !== "id"
      ) {
        keyMapping[col.accessorKey] = col.newItemName || col.key;
      }
    });
    const renameKeys = (obj, keyMap) => {
      return Object.keys(obj).reduce((acc, key) => {
        const newKey = keyMap[key] || key;
        acc[newKey] = obj[key];
        return acc;
      }, {});
    };
    const finalData = rowData.map((row) => renameKeys(row, keyMapping));
    const preprocessedData = preprocessData(finalData, convertToArray());

    const csv = generateCsv(csvConfig)(preprocessedData);
    console.log("preprocessData: ", csv);
    download(csvConfig)(csv);
  };
  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className='w-full items-center justify-center overflow-x-auto'>
        <table
          className='p-2 border-l'
          style={{ width: table?.getTotalSize() }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className='p-[5px] border-b h-[52px] min-h-[0px] min-w-[80px]'
                    key={header.id}
                    style={{
                      position: "relative",
                      maxwidth: header.getSize(),
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div className='min-w-[40px]'>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>

                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`resizer ${
                            header.column.getIsResizing() ? "isResizing" : ""
                          }`}
                        ></div>
                      </>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} gId={groupId} />
              ))}
            </SortableContext>
            <tr className=''>
              {columns.map((column, index) => (
                <TableFooter key={index} column={column} data={data} />
              ))}
            </tr>

            <tr className='w-full flex items-center justify-center p-1 hover:cursor-pointer h-[52px]'>
              <div>
                <Button
                  className='text-sm my-[8px] ml-[8px] font-helvetica bg-a-blue text-white '
                  onPress={() => addNewRow()}
                  size='sm'
                >
                  Add Item
                </Button>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
      {convertToArray().length > 0 && (
        <>
          <div
            className={`fixed bg-a-white rounded-[12px] left-[50%] bottom-[8px]`}
          >
            <div className={`px-[4px] py-[2px]`}>
              <Button
                className='w-[132px] justify-start font-helvetica text-[14px] text-a-blue border-r-1'
                radius='none'
                variant='light'
                startContent={<CiExport className='size-[48%]' />}
                onPress={exportCsv}
              >
                Export CSV
              </Button>
              <Button
                className='w-[132px] justify-start font-helvetica text-[14px] text-a-red'
                radius='none'
                variant='light'
                startContent={<MdOutlineDelete className='size-[48%]' />}
                onPress={deleteSelectedRows}
              >
                Delete Task
              </Button>
            </div>
          </div>
        </>
      )}
    </DndContext>
  );
};

export default Tasktable;
