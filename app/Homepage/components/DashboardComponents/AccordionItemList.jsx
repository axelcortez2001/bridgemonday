import { Accordion, AccordionItem } from "@nextui-org/react";
import EditableGroupName from "../EditableGroupName";
import Tasktable from "../tasktable";
import { dataColumns } from "../functions/hookfunctions";
import { useEffect, useState } from "react";
import { checkProject } from "@/app/Homepage/datastore";
import { useAtom, useAtomValue } from "jotai";

const AccordionItemList = ({ setKey, data, groupData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isProject = useAtomValue(checkProject);

  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, [isProject]);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const startContent = (
    <div>
      <EditableGroupName projectId={data._id} groupData={groupData} />
    </div>
  );

  const content = (
    <div>
      <Tasktable
        projectId={data._id}
        groupId={groupData.id}
        groupData={groupData.task}
        columnData={dataColumns(data.columns)}
      />
    </div>
  );

  const title = (
    <div>
      <span>
        {groupData.groupName.charAt(0).toUpperCase() +
          groupData.groupName.slice(1)}
      </span>
      <span className="font-normal">
        {groupData?.task.length > 0
          ? " - " +
            groupData?.task.length +
            " Item" +
            (groupData?.task.length > 1 ? "s" : "")
          : ""}
      </span>
    </div>
  );

  return (
    <div>
      <Accordion key={setKey + data._id} className="bg-a-white rounded-lg">
        <AccordionItem
          onPress={handleOpen}
          startContent={isOpen ? startContent : null}
          title={title}
          aria-label="title"
          classNames={{
            title: "text-base font-bold",
            startContent: "z-10",
            titleWrapper: "z-10",
          }}
        >
          {content}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionItemList;
