import {
  Input,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  Button,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { UserDataAtom } from "../../datastore";
import { toast } from "sonner";

const tableheader = [
  { label: "Text", key: "text" },
  { label: "Status", key: "status" },
  { label: "Number", key: "number" },
  { label: "Date", key: "date" },
  { label: "Dropdown", key: "dropdown" },
];
const defaultStatus = [
  { id: 0, color: "bg-a-green", text: "Done" },
  { id: 1, color: "bg-a-orange", text: "Working On It" },
  { id: 2, color: "bg-a-red", text: "Stuck" },
  { id: 3, color: "bg-a-blue", text: "On Hold" },
  { id: 4, color: "bg-a-grey", text: "None" },
];
const defaultDropdown = [{ id: 0, color: "bg-a-grey", text: "Default" }];
const addColumnIndex = { id: "add", key: "add", accessorKey: "Add", size: 2 };

const MatchColumns = ({ uploadedFile, setNewWorkSpaceData }) => {
  const [columns, setColumns] = useState([
    { id: "select", key: "select", size: 5 },
    { id: "expander", key: "expander", size: 5 },
  ]);
  const [selectedItemHeader, setSelectedItemHeader] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [groupTitle, setGroupTitle] = useState("");
  const groupId = uuidv4();
  const [type, setType] = useState("Personal");
  const [userData, setUserData] = useAtom(UserDataAtom || {});

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
    console.log("Extracted: ", extractHeaders(uploadedFile));
  }, [uploadedFile]);

  const handleSelectItem = (selected, header) => {
    if (selected === "item") {
      const newItem = {
        id: "item",
        key: "item",
        accessorKey: "item",
        header: header.text,
        size: 400,
      };
      setHeaders((prevHeaders) =>
        prevHeaders.map((head) =>
          head.text === header.text ? { ...head, accessorKey: "item" } : head
        )
      );
      setColumns((prevColumns) => [...prevColumns, newItem]);
      setSelectedItemHeader(header.text);
    } else if (selected === "text") {
      const aKey = "text" + uuidv4();
      const newItem = {
        key: "text",
        newItemName: header.text,
        accessorKey: aKey,
      };
      setHeaders((prevHeaders) =>
        prevHeaders.map((head) =>
          head.text === header.text ? { ...head, accessorKey: aKey } : head
        )
      );
      setColumns((prevColumns) => [...prevColumns, newItem]);
    } else if (selected === "number") {
      const aKey = "number" + uuidv4();
      const newItem = {
        key: "number",
        newItemName: header.text,
        accessorKey: aKey,
      };
      setHeaders((prevHeaders) =>
        prevHeaders.map((head) =>
          head.text === header.text ? { ...head, accessorKey: aKey } : head
        )
      );
      setColumns((prevColumns) => [...prevColumns, newItem]);
    } else if (selected === "date") {
      const aKey = "date" + uuidv4();
      const newItem = {
        key: "date",
        newItemName: header.text,
        accessorKey: aKey,
      };
      setHeaders((prevHeaders) =>
        prevHeaders.map((head) =>
          head.text === header.text ? { ...head, accessorKey: aKey } : head
        )
      );
      setColumns((prevColumns) => [...prevColumns, newItem]);
    } else if (selected === "status") {
      const aKey = "status" + uuidv4();
      const newItem = {
        key: "status",
        newItemName: header.text,
        accessorKey: aKey,
      };
      setHeaders((prevHeaders) =>
        prevHeaders.map((head) =>
          head.text === header.text ? { ...head, accessorKey: aKey } : head
        )
      );
      setColumns((prevColumns) => [...prevColumns, newItem]);
    } else if (selected === "dropdown") {
      const aKey = "dropdown" + uuidv4();
      const newItem = {
        key: "dropdown",
        newItemName: header.text,
        accessorKey: aKey,
      };
      setHeaders((prevHeaders) =>
        prevHeaders.map((head) =>
          head.text === header.text ? { ...head, accessorKey: aKey } : head
        )
      );
      setColumns((prevColumns) => [...prevColumns, newItem]);
    } else if (selected === "" || selected === undefined) {
      const newCol = columns.filter(
        (col) => col.accessorKey !== header?.accessorKey
      );
      setHeaders((prevHeaders) =>
        prevHeaders.map((head) =>
          head.text === header.text ? { ...head, accessorKey: "" } : head
        )
      );
      setColumns(newCol);
      setSelectedItemHeader(null);
    }
  };
  useEffect(() => {
    console.log("Columns: ", columns);
    console.log("headers: ", headers);
    console.log("type: ", type);
    console.log("uploadedFile: ", uploadedFile);
  }, [columns, headers, type, uploadedFile]);
  const handleSaveNewData = () => {
    const renameUploadedFile = (uploadedFile, headers) => {
      const keyMapping = headers.reduce((acc, header) => {
        acc[header.text] = header.accessorKey;
        return acc;
      }, {});
      const findStatus = (text) => {
        let existingStatus = defaultStatus.find(
          (status) => status.text === text
        );
        if (!existingStatus) {
          const highestId = Math.max(
            ...defaultStatus.map((status) => status.id)
          );
          if (text !== "" && text !== undefined && text !== null) {
            const newStatus = {
              id: highestId + 1,
              color: "bg-a-grey",
              text: text,
            };
            defaultStatus.push(newStatus);
            existingStatus = newStatus;
          }
        }
        return existingStatus;
      };
      const findDropdown = (text) => {
        let existingDropdown = defaultDropdown.find(
          (dropdown) => dropdown.text === text
        );
        if (!existingDropdown) {
          const highestId = Math.max(
            ...defaultDropdown.map((dropdown) => dropdown.id)
          );
          console.log("text: ", text);
          if (text !== "" && text !== undefined && text !== null) {
            console.log("trihher");
            const newDropdown = {
              id: highestId + 1,
              color: "bg-a-grey",
              text: text,
            };
            defaultDropdown.push(newDropdown);
            existingDropdown = newDropdown;
          } else {
            console.log("Trihher else");
          }
        }
        console.log("existingDropdown: ", existingDropdown);
        return existingDropdown;
      };

      return uploadedFile.map((item, index) => {
        const renamedItem = { id: index };
        Object.keys(item).forEach((key) => {
          const newKey = keyMapping[key] || key;
          if (newKey.startsWith("status")) {
            renamedItem[newKey] = findStatus(item[key]);
          } else if (newKey.startsWith("dropdown")) {
            renamedItem[newKey] = findDropdown(item[key]);
          } else {
            renamedItem[newKey] = item[key];
          }
        });
        return renamedItem;
      });
    };
    const renamedData = renameUploadedFile(uploadedFile, headers);
    const owner = userData;
    owner["organizer"] = true;
    const newData = {
      name: projectTitle,
      charts: [],
      columns: [...columns, addColumnIndex],

      defaultDropDown: defaultDropdown,
      defaultStatus: defaultStatus,
      grouptask: { groupName: groupTitle, id: groupId, task: renamedData },
      organizer: [owner],
      subColumns: [],
      type: type,
    };
    if (userData !== null && projectTitle !== "" && groupTitle !== "") {
      setNewWorkSpaceData(newData);
    } else {
      toast.error("Incomplete Data");
      console.log("Error");
    }
    console.log("newData: ", newData);
  };

  return (
    <div className='p-4 max-h-[700px] overflow-y-auto'>
      {headers && headers.length > 0 && (
        <div className='flex flex-col gap-3'>
          <div className='flex flex-row items-center'>
            <p className='w-32'>Project Name: </p>
            <Input
              placeholder='Enter Project Title'
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
            />
          </div>
          <div className='flex flex-row items-center'>
            <p className='w-32'>Group Name: </p>
            <Input
              placeholder='Enter Group Name'
              value={groupTitle}
              onChange={(e) => setGroupTitle(e.target.value)}
            />
          </div>
          <div className='flex flex-row w-full'>
            <RadioGroup
              label='Select Project Type:'
              orientation='horizontal'
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <Radio value='Personal'>Personal</Radio>
              <Radio value='Shared'>Shared</Radio>
            </RadioGroup>
          </div>
          {headers.map((header, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div className='w-60'>{header.text}</div>
              <div className='flex w-full flex-wrap md:flex-nowrap gap-4'>
                <Select
                  className='max-w-xs'
                  label='Select Column'
                  onChange={(e) => handleSelectItem(e.target.value, header)}
                  disabledKeys={
                    selectedItemHeader && selectedItemHeader !== header.text
                      ? ["item"]
                      : []
                  }
                >
                  <SelectItem key='item'>Item</SelectItem>
                  {tableheader.map((head, index) => (
                    <SelectItem key={head.key}>{head.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          ))}
          <div>
            <Button className='border p-2' onClick={() => handleSaveNewData()}>
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchColumns;
