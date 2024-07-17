import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { renameUploadedFile } from "../../functions/ImportFunction";
import { toast } from "sonner";

const MatchGroupColumns = ({ data, uploadedFile, setNewGroupData }) => {
  const columns = data.columns;
  const [headers, setHeaders] = useState([]);
  const [selectedItemHeader, setSelectedItemHeader] = useState([]);
  const [groupTitle, setGroupTitle] = useState("");
  const defaultStatus = data?.defaultStatus;
  const defaultDropdown = data?.defaultDropDown;

  // Filter columns
  const tableHeader = columns
    .map((column) => {
      if (column?.key === "item") {
        return { ...column, newItemName: "Item" };
      } else if (
        column.newItemName !== null &&
        column.newItemName !== undefined
      ) {
        return column;
      }
      return null;
    })
    .filter((column) => column !== null);

  useEffect(() => {
    const extractHeaders = (arr) => {
      let headers = [];
      arr.forEach((obj) => {
        Object.keys(obj).forEach((key) => {
          if (!headers.some((h) => h.text === key)) {
            headers.push({ text: key });
          }
        });
      });
      return headers;
    };
    setHeaders(extractHeaders(uploadedFile));
  }, [uploadedFile]);

  const deleteHeaderItem = (a, b) => {
    const oldItem = { ...a };
    delete oldItem[b.text];
    return oldItem;
  };
  const handleNewGroupItem = (selected, header) => {
    setSelectedItemHeader((prevSelected) => {
      const isAlreadySelected = prevSelected[header.text] === selected;
      if (isAlreadySelected) {
        const newSelected = { ...prevSelected };
        delete newSelected[header.text];
        return newSelected;
      } else {
        return {
          ...prevSelected,
          [header.text]: selected,
        };
      }
    });
    setHeaders((prevHeaders) =>
      prevHeaders.map((head) =>
        head.text === header.text ? { ...head, accessorKey: selected } : head
      )
    );
  };
  const handleAddGroupItem = () => {
    if (groupTitle === "") {
      toast.error("Please Input Group Title");
    } else {
      const groupData = renameUploadedFile(
        uploadedFile,
        headers,
        defaultStatus,
        defaultDropdown
      );
      const newGroupData = { groupName: groupTitle, task: groupData };
      setNewGroupData(newGroupData);
    }
  };

  return (
    <div className='p-4 max-h-[700px] overflow-y-auto'>
      {headers && headers.length > 0 && (
        <div className='flex flex-col gap-3'>
          <div className='flex flex-row items-center'>
            <p className='w-32'>Group Name: </p>
            <Input
              placeholder='Enter Group Name'
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
            />
          </div>

          {headers.map((header, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div className='w-60'>{header.text}</div>
              <div className='flex w-full flex-wrap md:flex-nowrap gap-4'>
                <Select
                  className='max-w-xs'
                  label='Select Column'
                  onChange={(e) => handleNewGroupItem(e.target.value, header)}
                  disabledKeys={
                    Object.values(selectedItemHeader).includes(
                      header.accessorKey
                    )
                      ? Object.values(
                          deleteHeaderItem(selectedItemHeader, header)
                        )
                      : Object.values(selectedItemHeader)
                  }
                >
                  {tableHeader.map((head) => (
                    <SelectItem key={head.accessorKey}>
                      {head.newItemName}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          ))}
          <div>
            <Button className='border p-2' onClick={() => handleAddGroupItem()}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchGroupColumns;
