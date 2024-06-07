import { atom } from "jotai";
import EditableCell from "./components/tablecomponents/EditableCell";
import OptionCell from "./components/tablecomponents/OptionCell";
import DateCell from "./components/tablecomponents/DateCell";
import PersonCell from "./components/tablecomponents/PersonCell";
import DefaultDateCell from "./components/tablecomponents/DefaultDateCell";
import DefaultTimeCell from "./components/tablecomponents/DefaultTimeCell";
import NumberCell from "./components/tablecomponents/NumberCell";
import DropDownCell from "./components/tablecomponents/DropDownCell";
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
  const userResponse = await restinsert("/user", data.value);
  if (userResponse.success) {
    return { success: true, userResponse };
  } else {
    return { success: false };
  }
});

//function to get all users
export const userAtom = atom(async () => {
  const user = await getAllUsers("/user");
  return user?.user;
});

let statusId = 0;
let dropId = 0;
let subItemId = 0;

export const statusesData = [
  { id: statusId++, color: "bg-a-green", text: "Done" },
  { id: statusId++, color: "bg-a-orange", text: "Working On It" },
  { id: statusId++, color: "bg-a-red", text: "Stuck" },
  { id: statusId++, color: "bg-a-blue", text: "On Hold" },
  { id: statusId++, color: "bg-a-grey", text: "None" },
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
  const user = get(UserDataAtom);
  const sub = user.value.sub;
  const workSpace = await getWorkspace("/modaydata", sub);
  if (workSpace && workSpace?.success) {
    set(projectsAtom, workSpace?.workspace);
  }
});

export const setOrganizers = atom(null, async (get, set, projectId, user) => {
  const projects = get(projectsAtom);
  const updateProjects = projects?.map((project) => {
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
  if (updated && updated?.success === true) {
    set(projectsAtom, updateProjects);
    return { success: true, message: "User added!" };
  } else {
    return { success: false, message: "Failed to add User" };
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
  if (updated && updated?.success === true) {
    set(projectsAtom, updatedProjects);
    return { success: true, message: "User deleted!" };
  } else {
    return { success: false, message: "Failed to remove User" };
  }
});
//selection of atom from sidebar
export const selectedProject = atom(null);

export const selectedProjectAtom = atom((get) => {
  const projects = get(projectsAtom);
  const selectedProjectId = get(selectedProject);
  if (projects && projects.length > 0) {
    return projects.find((project) => project._id === selectedProjectId);
  } else {
    return { message: "Project not found" };
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
  if (returnProject && returnProject?.success === true) {
    set(projectsAtom, [...prevProject, returnProject.workspace]);
    return { success: true };
  } else {
    alert("Failed to add project");
    return { success: false };
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
  if (updatedProjectFromBackEnd && updatedProjectFromBackEnd?.success) {
    set(projectsAtom, updatedProjects);
    return { success: true };
  } else {
    alert("Error: Failed to edit project");
    return { success: false };
  }
});

//function to delete project
export const deleteProject = atom(null, async (get, set, id) => {
  const prevProjects = get(projectsAtom);
  const deleted = await deleteWorkSpace("/modaydata", id);
  if (deleted && deleted?.success === true) {
    const newProject = prevProjects.filter((project) => project._id !== id);
    set(projectsAtom, newProject);
    return { success: true };
  } else {
    set(projectsAtom, prevProjects);
    return { success: true };
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
  if (updatedProjects && updatedProjects?.success === true) {
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
    return { success: true };
  } else {
    return { success: false };
  }
});
export const deleteGroupTask = atom(
  null,
  async (get, set, projectId, groupId) => {
    const projects = get(projectsAtom);
    const id = projectId;
    const updatedProjects = projects.map((project) => {
      if (project._id === projectId) {
        const updatedGrouptask = project?.grouptask.filter(
          (group) => group.id !== groupId
        );
        return {
          ...project,
          grouptask: updatedGrouptask,
        };
      } else {
        return project;
      }
    });
    const updated = await updateWholeWorkSpace(
      "/modaydata/update",
      updatedProjects
    );
    if (updated && updated.success === true) {
      set(projectsAtom, updatedProjects);
      return { success: true };
    } else {
      return { success: false };
    }
  }
);

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
  if (updated && updated.success === true) {
    set(projectsAtom, updatedProjects);
    return { success: true };
  } else {
    return { success: false };
  }
});

//function to add an Subitem to a group
export const addSubItemColumn = atom(
  null,
  async (get, set, projectId, itemName) => {
    let newAccessorName = itemName.toLocaleLowerCase() + uuidv4();
    const projects = get(projectsAtom);
    const foundProject = projects.find((project) => project._id === projectId);
    const itemCell = subtextItem.filter(
      (item) => item.name.toLocaleLowerCase() === itemName.toLocaleLowerCase()
    );
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
                  subItems: task?.subItems?.map((subItem) => {
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
    if (updated && updated.success === true) {
      set(projectsAtom, updatedProjects);
      return { success: true };
    } else {
      return { success: false };
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
    if (updated && updated.success === true) {
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
    if (updated && updated.success === true) {
      set(projectsAtom, updatedProject);
      return { success: true };
    } else {
      return { success: false };
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
    if (updated && updated.success === true) {
      set(projectsAtom, updatedProjects);
      return { success: true };
    } else {
      return { success: false };
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
    if (updated && updated.success === true) {
      set(projectsAtom, updatedProjects);
      return { success: true };
    } else {
      return { success: false };
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
              const { [newKey]: _, ...rest } = task;
              return rest;
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
  if (updated && updated.success === true) {
    set(projectsAtom, updatedProject);
    return { success: true };
  } else {
    return { success: false };
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
                subItems: task?.subItems?.map((subItem) => {
                  const { [newKey]: _, ...rest } = subItem;
                  return rest;
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
  if (updated && updated.success === true) {
    set(projectsAtom, updatedProject);
    return { success: true };
  } else {
    return { success: false };
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
    if (updated && updated.success === true) {
      set(projectsAtom, updatedProjects);
      return { success: true };
    } else {
      return { success: false };
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
    if (updated && updated.success === true) {
      set(projectsAtom, updatedProjects);
      const updatedProject = updatedProjects.find(
        (project) => project._id === projectId
      );
      const updatedGroupTask = updatedProject.grouptask.find(
        (groupTask) => groupTask.id === groupId
      );
      return { success: true, task: updatedGroupTask.task };
    } else {
      return { success: false };
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
                  console.log("Before Updating Project " + task);
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
                        subItems: task.subItems
                          ? [...task.subItems, newRow]
                          : [newRow],
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
      return { success: true, task: updatedSubItem.subItems };
    } else return { success: false };
  }
);
