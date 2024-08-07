"use client";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Button,
  Avatar,
  Spinner,
} from "@nextui-org/react";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { deleteGroupTask, updateGroupName } from "../datastore";
import { MdDeleteOutline, MdOutlineModeEdit, MdIosShare } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { toast } from "sonner";

const EditableGroupName = ({ projectId, groupData }) => {
  const [newGroupName, setGroupTitle] = useState(groupData.groupName);
  const delGroup = useSetAtom(deleteGroupTask);
  const groupId = groupData.id;
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [option, setOption] = useState("");

  const updateName = useSetAtom(updateGroupName);

  const handleSave = async () => {
    try {
      setLoading(true);
      const status = await updateName({ projectId, groupId, newGroupName });
      toast.success("Successfuly updated a group!");
      if (!status && !status.success) {
        toast("Error Updating Group Name");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ecountered an error updating a group!");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleDelete = async () => {
    const groupId = groupData.id;

    console.log("del" + groupId);

    if (groupId) {
      try {
        setLoading(true);
        await delGroup(projectId, groupId);
        toast.success("Successfuly deleted a group!");
        onClose();
      } catch (e) {
        console.error("no group id");
        toast.error("error on deleting a group!");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("no group id");
    }
  };

  const handleOpen = (Option) => {
    setOption(Option);
    onOpen();
  };

  return (
    <div className="flex w-full justify-between items-center whitespace-nowrap p-1">
      <div>
        <Dropdown className="w-[132px] min-w-[0pFx] p-[0px]">
          <DropdownTrigger>
            <div>
              <SlOptionsVertical />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Items">
            <DropdownItem onPress={() => handleOpen("Edit")} aria-label="Edit">
              <div className="justify-start items-center flex space-x-2">
                <MdOutlineModeEdit /> <span className="text-a-black">Edit</span>
              </div>
            </DropdownItem>
            <DropdownItem
              onPress={() => handleOpen("Delete")}
              aria-label="Delete"
            >
              <div className="justify-start items-center flex space-x-2">
                <MdDeleteOutline className="text-a-red" />{" "}
                <span className="text-a-red">Delete</span>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        {option === "Edit" ? (
          <ModalContent>
            {!loading ? (
              <>
                <form action={handleSave}>
                  <ModalHeader>Edit Header Name</ModalHeader>
                  <ModalBody>
                    <Input
                      placeholder="Title"
                      label="Group Name"
                      value={newGroupName}
                      onChange={(e) => setGroupTitle(e.target.value)}
                      isRequired
                      autoFocus={isOpen ? true : false}
                    ></Input>
                  </ModalBody>
                  <ModalFooter>
                    <Button className="bg-a-blue text-a-white" type="submit">
                      Save
                    </Button>
                  </ModalFooter>
                </form>
              </>
            ) : (
              <>
                <ModalHeader>Edit Header Name</ModalHeader>
                <ModalBody>
                  <Spinner />
                </ModalBody>
                <ModalFooter>
                  <Button className="bg-a-blue text-a-white" disabled>
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        ) : (
          <ModalContent>
            {!loading ? (
              <>
                <ModalHeader>Delete</ModalHeader>
                <ModalBody>
                  <p>
                    Are you sure you want to delete
                    <span className="font-bold"> {groupData.groupName}</span>
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    className="bg-a-red text-a-white"
                    onPress={handleDelete}
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </>
            ) : (
              <>
                <ModalHeader>Delete</ModalHeader>
                <ModalBody>
                  <Spinner />
                </ModalBody>
                <ModalFooter>
                  <Button className="bg-a-red text-a-white" disabled>
                    Delete
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        )}
      </Modal>
    </div>
  );
};
export default EditableGroupName;
