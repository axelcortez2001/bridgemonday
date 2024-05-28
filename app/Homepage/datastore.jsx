import { atom } from "jotai";
import { RowDragHandleCell } from "./components/functions/tablefunctions";
import EditableCell from "./components/tablecomponents/EditableCell";
import AddDropDown from "./components/otherComponents/AddDropDown";
import OptionCell from "./components/tablecomponents/OptionCell";
import DateCell from "./components/tablecomponents/DateCell";
import PersonCell from "./components/tablecomponents/PersonCell";
import DefaultDateCell from "./components/tablecomponents/DefaultDateCell";
import DefaultTimeCell from "./components/tablecomponents/DefaultTimeCell";
import NumberCell from "./components/tablecomponents/NumberCell";
import DropDownCell from "./components/tablecomponents/DropDownCell";
import EditableHeader from "./components/tablecomponents/EditableHeader";
import AddSubItemDropDown from "./components/otherComponents/AddSubItemDropDown";
import EditableSubHeader from "./components/tablecomponents/EditableSubHeader";
import {
  addNewGrouptask,
  addWorkspace,
  deleteWorkSpace,
  editWorkSpace,
  getAllUsers,
  getWorkspace,
  restinsert,
  updateWholeWorkSpace,
} from "../utils";
import { fetchUserAttributes } from "aws-amplify/auth";
import { v4 as uuidv4 } from "uuid";

//fetch curentUser
async function fetchUserData() {
  try {
    const user = await fetchUserAttributes();
    if (user.sub) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
export const UserDataAtom = atom(async () => {
  return await fetchUserData();
});
//function to register user to database
export const registerUser = atom(null, async (get, set) => {
  const data = get(UserDataAtom);
  console.log("before user: ", data.value);
  const userResponse = await restinsert("/user", data.value);
  console.log("UserResponse: " + userResponse);
  if (userResponse.success) {
    return { success: true, userResponse };
  } else {
    return { success: false };
  }
});

//function to get all users
export const userAtom = atom(async () => {
  const user = await getAllUsers("/user");
  console.log("userasd: ", user.user);
  return user.user;
});

let projectid = 0;
let groupId = 0;
let taskid = 0;
let statusId = 0;
let itemId = 0;
let dropId = 0;
let subItemId = 0;

export const statusesData = [
  { id: statusId++, color: "bg-green-500", text: "Done" },
  { id: statusId++, color: "bg-orange-500", text: "Working On It" },
  { id: statusId++, color: "bg-red-500", text: "Stuck" },
  { id: statusId++, color: "bg-blue-500", text: "On Hold" },
  { id: statusId++, color: "bg-gray-500", text: "None" },
];
export const textItem = [
  {
    name: "text",
    cell: EditableCell,
    data: "",
  },
  { name: "status", cell: OptionCell, data: statusesData },
  { name: "date", cell: DateCell, data: "" },
  { name: "people", cell: PersonCell, data: [] },
  { name: "DefaultDate", cell: DefaultDateCell, data: "" },
  { name: "DefaultTime", cell: DefaultTimeCell, data: "" },
  { name: "number", cell: NumberCell, data: "" },
  { name: "DropDown", cell: DropDownCell, data: [] },
];
export const subtextItem = [
  {
    name: "subtext",
    cell: EditableCell,
    data: "",
  },
  { name: "substatus", cell: OptionCell, data: statusesData },
  { name: "subdate", cell: DateCell, data: "" },
  { name: "subpeople", cell: PersonCell, data: [] },
  { name: "subDefaultDate", cell: DefaultDateCell, data: "" },
  { name: "subDefaultTime", cell: DefaultTimeCell, data: "" },
  { name: "subnumber", cell: NumberCell, data: "" },
  { name: "subDropDown", cell: DropDownCell, data: [] },
];
export const defaultColumn = [
  {
    id: "select",
    key: "select",
    size: 5,
  },
  {
    id: "expander",
    key: "expander",
    size: 5,
  },
  {
    id: "item",
    key: "item",
    accessorKey: "item",
    header: "Item",
    size: 400,
  },
  { id: "add", key: "add", accessorKey: "Add", size: 2 },
];

export const defaultSubColumns = [
  {
    id: "select",
    key: "select",
    size: 5,
  },
  {
    id: "item",
    key: "item",
    accessorKey: "item",
    header: "Item",
    size: 400,
  },
  { id: "addsub", key: "addsub", accessorKey: "Add", size: 2 },
];

// const getProjects = async () => {
//   const workSpace = await getWorkspace("/modaydata");
//   console.log("workSpace", workSpace);
//   return workSpace?.workSpace;
// };
export const projectsAtom = atom([]);

export const getProjects = atom(null, async (get, set) => {
  const workSpace = await getWorkspace("/modaydata");
  set(projectsAtom, workSpace?.workspace);
});

export const setOrganizers = atom(null, async (get, set, projectId, user) => {
  console.log(projectId);
  const projects = get(projectsAtom);
  const updateProjects = projects.map((project) => {
    if (project._id === projectId) {
      return {
        ...project,
        organizer: [...project.organizer, user],
      };
    }
    return project;
  });

  const updated = await updateWholeWorkSpace(
    "/modaydata/update",
    updateProjects
  );
  if (updated.success === true) {
    set(projectsAtom, updateProjects);
  }
});
export const removeOrganizer = atom(null, async (get, set, projectId, sub) => {
  const projects = get(projectsAtom);
  const updatedProjects = projects.map((project) => {
    if (project._id === projectId) {
      const updatedOrganizer = [...project.organizer];
      const index = updatedOrganizer.findIndex((org) => org.sub === sub);
      if (index !== -1) {
        updatedOrganizer.splice(index, 1);
      }
      return {
        ...project,
        organizer: updatedOrganizer,
      };
    }
    return project;
  });
  const updated = await updateWholeWorkSpace(
    "/modaydata/update",
    updatedProjects
  );
  if (updated.success === true) {
    set(projectsAtom, updatedProjects);
  }
});
//selection of atom from sidebar
export const selectedProject = atom(1);

export const selectedProjectAtom = atom((get) => {
  const projects = get(projectsAtom);
  console.log("ProjectId: ", selectedProject);
  const selectedProjectId = get(selectedProject);
  console.log("project Len: " + projects);
  if (projects.length > 0) {
    return projects.find((project) => project._id === selectedProjectId);
  }
});

//function to add new project
export const addProject = atom(null, async (get, set, { title, privacy }) => {
  const prevProject = get(projectsAtom);
  const userData = get(UserDataAtom);
  const newProject = {
    name: title,
    type: privacy,
    columns: defaultColumn,
    subColumns: defaultSubColumns,
    organizer: [userData.value],
    defaultStatus: statusesData,
    defaultDropDown: [],
    grouptask: [],
  };
  const returnProject = await addWorkspace("/modaydata", newProject);
  if (returnProject && returnProject.success === true) {
    set(projectsAtom, [...prevProject, returnProject.workspace]);
  }
});

//function to edit project
export const editProject = atom(null, async (get, set, id, title, privacy) => {
  const prevProjects = get(projectsAtom);
  const updatedProjectFromBackEnd = await editWorkSpace(
    "/modaydata",
    id,
    title,
    privacy
  );
  console.log("Updated", updatedProjectFromBackEnd);
  const updatedProjects = prevProjects.map((project) =>
    project._id === id ? { ...project, name: title, type: privacy } : project
  );
  set(projectsAtom, updatedProjects);
});

//function to delete project
export const deleteProject = atom(null, async (get, set, id) => {
  const prevProjects = get(projectsAtom);
  const deleted = await deleteWorkSpace("/modaydata", id);
  if (deleted && deleted.success === true) {
    const newProject = prevProjects.filter((project) => project._id !== id);
    set(projectsAtom, newProject);
  } else {
    set(projectsAtom, prevProjects);
  }
});

//function to add group task
export const addGroupTask = atom(null, async (get, set, projectId) => {
  const projects = get(projectsAtom);
  const groupData = { id: uuidv4(), groupName: "New Group", task: [] };
  const id = projectId;
  const updatedProjects = await addNewGrouptask(
    "/modaydata/grouptask",
    id,
    groupData
  );
  if (updatedProjects.success === true) {
    const updatedProjects = projects.map((project) => {
      if (project._id === projectId) {
        return {
          ...project,
          grouptask: [...project.grouptask, groupData],
        };
      } else {
        return project;
      }
    });
    set(projectsAtom, updatedProjects);
  }
});

//function to add an item to a group
export const addNewItem = atom(null, async (get, set, projectId, itemName) => {
  let newItemName = itemName;
  let newAccessorName = itemName.toLocaleLowerCase() + uuidv4();
  const projects = get(projectsAtom);
  const foundProject = projects.find((project) => project._id === projectId);
  const itemCell = textItem.filter(
    (item) => item.name.toLocaleLowerCase() === itemName.toLocaleLowerCase()
  );
  //item duplication
  const newItem = foundProject.columns.filter(
    (column) =>
      column?.key?.toLocaleLowerCase() === itemName?.toLocaleLowerCase()
  );
  if (newItem.length > 0) {
    let highestID = 0;
    console.log(newItem);
    newItem.map((item) => {
      if (item.id > highestID) {
        return highestID === item.id;
      }
    });
    console.log("Highest: ", highestID);
    newItemName = newItemName + (newItem.length + 1);
  }
  //newItemData
  const newItemData = {
    key: itemName.toLocaleLowerCase(),
    accessorKey: newAccessorName,
    newItemName: itemName,
    // header: <EditableHeader data={newItemName} accessorKey={newItemName} />,
    // cell: itemCell[0].cell,
  };

  //add the column before the add button
  const addColumnIndex = foundProject.columns.findIndex(
    (column) => column.accessorKey === "Add"
  );

  const updatedColumns = [...foundProject.columns];
  updatedColumns.splice(addColumnIndex, 0, newItemData);
  const updatedProjects = projects.map((project) => {
    if (project._id === projectId) {
      return {
        ...project,
        columns: updatedColumns,
        grouptask: project.grouptask.map((group) => {
          return {
            ...group,
            task: group.task.map((task) => {
              return {
                ...task,
                [newAccessorName]: itemCell[0].data,
              };
            }),
          };
        }),
      };
    } else {
      return project;
    }
  });

  const updated = await updateWholeWorkSpace(
    "/modaydata/update",
    updatedProjects
  );
  if (updated.success === true) {
    set(projectsAtom, updatedProjects);
  }
});

//function to add an Subitem to a group
export const addSubItemColumn = atom(
  null,
  async (get, set, projectId, itemName) => {
    let newItemName = itemName;
    let newAccessorName = itemName.toLocaleLowerCase() + uuidv4();
    const projects = get(projectsAtom);
    const foundProject = projects.find((project) => project._id === projectId);
    const itemCell = subtextItem.filter(
      (item) => item.name.toLocaleLowerCase() === itemName.toLocaleLowerCase()
    );
    //item duplication
    const newItem = foundProject.subColumns.filter(
      (column) =>
        column?.accessorKey?.toLocaleLowerCase() ===
        newItemName?.toLocaleLowerCase()
    );
    if (newItem.length > 0) {
      newItemName = newItemName + subItemId++;
    }
    //newItemData
    const newItemData = {
      key: itemName.toLocaleLowerCase(),
      accessorKey: newAccessorName,
      newItemName: itemName,
    };

    //add the column before the add button
    const addColumnIndex = foundProject.subColumns.findIndex(
      (column) => column.accessorKey === "Add"
    );

    const updatedColumns = [...foundProject.subColumns];
    updatedColumns.splice(addColumnIndex, 0, newItemData);
    const updatedProjects = projects.map((project) => {
      if (project._id === projectId) {
        return {
          ...project,
          subColumns: updatedColumns,
          grouptask: project.grouptask.map((group) => {
            return {
              ...group,
              task: group.task.map((task) => {
                return {
                  ...task,
                  subItem: task?.subItems?.map((subItem) => {
                    return {
                      ...subItem,
                      [newAccessorName.toLocaleLowerCase()]: itemCell[0].data,
                    };
                  }),
                };
              }),
            };
          }),
        };
      } else {
        return project;
      }
    });
    const updated = await updateWholeWorkSpace(
      "/modaydata/update",
      updatedProjects
    );
    if (updated.success === true) {
      set(projectsAtom, updatedProjects);
    }
  }
);

//function to update project
export const updateProject = atom(null, async (get, set) => {
  const projects = get(projectsAtom);
});
//function to add new status to a project
export const addNewStatus = atom(
  null,
  async (get, set, id, newStatus, newColor) => {
    const projects = get(projectsAtom);
    const newDefaultStatus = {
      id: statusId++,
      color: newColor,
      text: newStatus,
    };

    const updatedProject = projects.map((project) => {
      if (project._id === id) {
        return {
          ...project,
          defaultStatus: [...project.defaultStatus, newDefaultStatus],
        };
      }
      return project;
    });
    const updated = await updateWholeWorkSpace(
      "/modaydata/update",
      updatedProject
    );
    if (updated.success === true) {
      set(projectsAtom, updatedProject);
      return newDefaultStatus;
    }
  }
);

//fuinction to add new dropdown to a project
export const addNewDropDown = atom(
  null,
  async (get, set, id, newDropDown, newColor) => {
    const projects = get(projectsAtom);
    const newDefaultStatus = {
      id: dropId++,
      color: newColor,
      text: newDropDown,
    };

    const updatedProject = projects.map((project) => {
      if (project._id === id) {
        return {
          ...project,
          defaultDropDown: [...project.defaultDropDown, newDefaultStatus],
        };
      }
      return project;
    });
    const updated = await updateWholeWorkSpace(
      "/modaydata/update",
      updatedProject
    );
    if (updated.success === true) {
      set(projectsAtom, updatedProject);
      return newDefaultStatus;
    }
  }
);
//function to update groupName
export const updateGroupName = atom(
  null,
  async (get, set, { projectId, groupId, newGroupName }) => {
    const projects = get(projectsAtom);
    const updatedProjects = projects.map((project) => {
      if (project._id === projectId) {
        return {
          ...project,
          grouptask: project.grouptask.map((groupTask) => {
            if (groupTask.id === groupId) {
              return {
                ...groupTask,
                groupName: newGroupName,
              };
            }
            return groupTask;
          }),
        };
      }
      return project;
    });
    const updated = await updateWholeWorkSpace(
      "/modaydata/update",
      updatedProjects
    );
    if (updated.success === true) {
      set(projectsAtom, updatedProjects);
    }
  }
);

//function to update headerName
export const updateHeaderName = atom(
  null,
  async (get, set, projectId, oldName, newHeaderName) => {
    const projects = get(projectsAtom);
    const updatedProjects = projects.map((project) => {
      if (project._id === projectId) {
        const updatedColumns = project.columns.map((column) => {
          if (
            column?.accessorKey?.toLocaleLowerCase() ===
            oldName?.toLocaleLowerCase()
          ) {
            return {
              ...column,
              newItemName: newHeaderName,
            };
          }
          return column;
        });
        return { ...project, columns: updatedColumns };
      }
      return project;
    });
    const updated = await updateWholeWorkSpace(
      "/modaydata/update",
      updatedProjects
    );
    if (updated.success === true) {
      set(projectsAtom, updatedProjects);
    }
  }
);
//function to deletecolumn
export const deleteColumn = atom(null, async (get, set, projectId, key) => {
  const projects = get(projectsAtom);
  const foundProject = projects.find((project) => project._id === projectId);

  const newColumns = foundProject.columns.filter(
    (column) =>
      column?.accessorKey?.toLocaleLowerCase() !== key?.toLocaleLowerCase()
  );
  const newKey = key.toLocaleLowerCase();
  const updatedProject = projects.map((project) => {
    if (project._id === projectId) {
      return {
        ...project,
        columns: newColumns,
        grouptask: project.grouptask.map((group) => {
          return {
            ...group,
            task: group.task.map((task) => {
              return { ...task, [newKey]: null };
            }),
          };
        }),
      };
    } else {
      return project;
    }
  });
  const updated = await updateWholeWorkSpace(
    "/modaydata/update",
    updatedProject
  );
  if (updated.success === true) {
    set(projectsAtom, updatedProject);
  }
});
//function to delete subcolumns
export const deleteSubColumn = atom(null, async (get, set, projectId, key) => {
  const projects = get(projectsAtom);
  const foundProject = projects.find((project) => project._id === projectId);

  const newColumns = foundProject.subColumns.filter(
    (column) =>
      column?.accessorKey?.toLocaleLowerCase() !== key?.toLocaleLowerCase()
  );
  const newKey = key.toLocaleLowerCase();
  const updatedProject = projects.map((project) => {
    if (project._id === projectId) {
      return {
        ...project,
        subColumns: newColumns,
        grouptask: project.grouptask.map((group) => {
          return {
            ...group,
            task: group.task.map((task) => {
              return {
                ...task,
                subItem: task?.subItems?.map((subItem) => {
                  return {
                    ...subItem,
                    [newKey]: null,
                  };
                }),
              };
            }),
          };
        }),
      };
    } else {
      return project;
    }
  });
  const updated = await updateWholeWorkSpace(
    "/modaydata/update",
    updatedProject
  );
  if (updated.success === true) {
    set(projectsAtom, updatedProject);
  }
});
//function to update subheaderName
export const updateSubHeaderName = atom(
  null,
  async (get, set, projectId, oldName, newHeaderName) => {
    const projects = get(projectsAtom);
    const updatedProjects = projects.map((project) => {
      if (project._id === projectId) {
        const updatedColumns = project?.subColumns?.map((column) => {
          if (
            column?.accessorKey?.toLocaleLowerCase() ===
            oldName?.toLocaleLowerCase()
          ) {
            return {
              ...column,
              newItemName: newHeaderName,
            };
          }
          return column;
        });
        return { ...project, subColumns: updatedColumns };
      }
      return project;
    });
    const updated = await updateWholeWorkSpace(
      "/modaydata/update",
      updatedProjects
    );
    if (updated.success === true) {
      set(projectsAtom, updatedProjects);
    }
  }
);

//function to update tabledata
export const updateGroupData = atom(
  null,
  async (get, set, projectId, groupId, data, type) => {
    const projects = get(projectsAtom);
    const getId = (task) => {
      let taskIdData = 0;
      const len = task?.length || 0;
      for (let i = 0; i < len; i++) {
        if (task[i].id >= taskIdData) {
          taskIdData = task[i].id + 1;
        }
      }
      return taskIdData;
    };

    const updatedProjects = projects.map((project) => {
      if (project._id === projectId) {
        return {
          ...project,
          grouptask: project.grouptask.map((groupTask) => {
            if (groupTask.id === groupId) {
              if (type === "UpdateData") {
                return {
                  ...groupTask,
                  task: data,
                };
              } else {
                const newRow = {
                  id: getId(groupTask?.task) || 0,
                  item: "New Task",
                };
                return {
                  ...groupTask,
                  task: [...data, newRow],
                };
              }
            }
            return groupTask;
          }),
        };
      }
      return project;
    });
    const updated = await updateWholeWorkSpace(
      "/modaydata/update",
      updatedProjects
    );
    if (updated.success === true) {
      set(projectsAtom, updatedProjects);
      const updatedProject = updatedProjects.find(
        (project) => project._id === projectId
      );
      const updatedGroupTask = updatedProject.grouptask.find(
        (groupTask) => groupTask.id === groupId
      );
      return updatedGroupTask.task;
    }
  }
);

//function to update subItemData
export const updateSubItemData = atom(
  null,
  async (get, set, projectId, groupId, taskId, data, type) => {
    const projects = get(projectsAtom);
    const getId = (task) => {
      let taskIdData = 0;
      const len = task?.length || 0;
      for (let i = 0; i < len; i++) {
        if (task[i].id >= taskIdData) {
          taskIdData = task[i].id + 1;
        }
      }
      return taskIdData;
    };
    const updatedProjects = projects.map((project) => {
      if (project._id === projectId) {
        return {
          ...project,
          grouptask: project.grouptask.map((grouptask) => {
            if (grouptask.id === groupId) {
              return {
                ...grouptask,
                task: grouptask.task.map((task) => {
                  if (task.id === taskId) {
                    if (type === "UpdateData") {
                      return {
                        ...task,
                        subItems: data,
                      };
                    } else {
                      const newRow = {
                        id: getId(task.subItems),
                        item: "New SubTask",
                      };
                      return {
                        ...task,
                        subItems: [...data, newRow],
                      };
                    }
                  }
                  return task;
                }),
              };
            }
            return grouptask;
          }),
        };
      }
      return project;
    });
    const updated = await updateWholeWorkSpace(
      "/modaydata/update",
      updatedProjects
    );
    if (updated.success === true) {
      set(projectsAtom, updatedProjects);
      const updatedProject = updatedProjects.find(
        (project) => project._id === projectId
      );
      const updatedGroupTask = updatedProject.grouptask.find(
        (groupTask) => groupTask.id === groupId
      );
      const updatedSubItem = updatedGroupTask.task.find(
        (task) => task.id === taskId
      );
      return updatedSubItem.subItems;
    }
  }
);
