import { atom } from "jotai";

let projectid = 0;
let groupId = 0;
let taskid = 0;
let statusId = 0;
export const blankProject = atom([
  { id: projectid++, name: "New Group", grouptask: [] },
]);
export const statusesData = [
  { id: statusId++, color: "bg-green-500", text: "Done" },
  { id: statusId++, color: "bg-orange-500", text: "Working On It" },
  { id: statusId++, color: "bg-red-500", text: "Stuck" },
  { id: statusId++, color: "bg-violet-500", text: "Future Steps" },
  { id: statusId++, color: "bg-blue-500", text: "On Hold" },
  { id: statusId++, color: "bg-gray-500", text: "None" },
];
export const userAtom = atom([
  {
    sub: "34613191",
    name: "Axel Cortez",
    email: "john.cortez@aretex.com.au",
    picture: "@/../axelAvatar.jpg",
  },
  {
    sub: "34215465",
    name: "Chloe Lazaro",
    email: "chloe.lazaro@aretex.com.au",
    picture: "@/../Avatar2.jpg",
  },
  {
    sub: "34567823",
    name: "Cyrus Layugan",
    email: "cyrus.layugan@aretex.com.au",
    picture: "@/../Avatar3.png",
  },
  {
    sub: "34653245",
    name: "John Suelila",
    email: "suelila.john@aretex.com.au",
    picture: "@/../Avatar4.png",
  },
]);
export const UserDataAtom = atom({
  sub: "34613191",
  name: "Axel Cortez",
  email: "john.cortez@aretex.com.au",
  picture: "@/../axelAvatar.jpg",
});
export const projectsAtom = atom([
  {
    id: projectid++,
    name: "Project 1",
    type: "shared",
    defaultStatus: statusesData,
    organizer: {
      sub: "34613191",
      name: "Axel Cortez",
      email: "john.cortez@aretex.com.au",
      picture: "@/../axelAvatar.jpg",
    },
    grouptask: [
      {
        id: groupId++,
        groupName: "Group 1",

        task: [
          {
            id: taskid++,
            item: "Task 1",
            processors: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
              {
                sub: "34215465",
                name: "Chloe Lazaro",
                email: "chloe.lazaro@aretex.com.au",
                picture: "@/../Avatar2.jpg",
              },
            ],
            status: { id: statusId++, color: "gray-500", text: "None" },
            date: new Date("2024/05/13"),
            deadline: new Date("2024/05/13"),
            dateCompleted: new Date("2024/05/13"),
            managers: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            remarks: "Completed",
          },
          {
            id: taskid++,
            item: "Task 2",
            processors: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            status: { id: statusId++, color: "red-500", text: "Stuck" },
            date: "",
            deadline: new Date("2024/05/13"),
            dateCompleted: "",
            managers: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            remarks: "Compl sadsadeted",
          },
          {
            id: taskid++,
            item: "Task 3",
            processors: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            status: { id: statusId++, color: "gray", text: "" },
            date: "",
            deadline: new Date("2024/05/13"),
            dateCompleted: "",
            managers: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            remarks: "Comfdsapleted ",
          },
        ],
      },
      {
        id: groupId++,
        groupName: "Group 2",
        task: [
          {
            id: taskid++,
            item: "Task 1",
            processors: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            status: { id: statusId++, color: "gray", text: "" },
            date: "",
            deadline: "",
            dateCompleted: "",
            managers: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            remarks: "Complet asd saded",
          },
          {
            id: taskid++,
            item: "Task 2",
            processors: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            status: { id: statusId++, color: "gray", text: "" },
            date: "",
            deadline: "",
            dateCompleted: "",
            managers: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            remarks: "Compl sads asd asdadeted",
          },
          {
            id: taskid++,
            item: "Task 3",
            processors: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            status: { id: statusId++, color: "gray", text: "" },
            date: "",
            deadline: "",
            dateCompleted: "",
            managers: [
              {
                sub: "34613191",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "@/../axelAvatar.jpg",
              },
            ],
            remarks: "Comfdsa asdasd pleted ",
          },
        ],
      },
    ],
  },
]);

//selection of atom from sidebar
export const selectedProject = atom(1);
export const selectedProjectAtom = atom((get) => {
  const projects = get(projectsAtom);
  const selectedProjectId = get(selectedProject);
  console.log("Project", projects);
  return projects.find((project) => project.id === selectedProjectId);
});

//function to add new project
export const addProject = atom(null, (get, set, { title, privacy }) => {
  const prevProject = get(projectsAtom);
  const userData = get(UserDataAtom);
  const newProject = {
    id: projectid++,
    name: title,
    type: privacy,
    organizer: userData,
    defaultStatus: statusesData,
    grouptask: [],
  };
  console.log(newProject);
  return set(projectsAtom, [...prevProject, newProject]);
});

//function to edit project
export const editProject = atom(null, (get, set, id, title, privacy) => {
  const prevProjects = get(projectsAtom);
  const updatedProjects = prevProjects.map((project) =>
    project.id === id ? { ...project, name: title, type: privacy } : project
  );
  set(projectsAtom, updatedProjects);
});

//function to delete project
export const deleteProject = atom(null, (get, set, id) => {
  const prevProjects = get(projectsAtom);
  const newProject = prevProjects.filter((project) => project.id !== id);
  set(projectsAtom, newProject);
});

//function to add group task
export const addGroupTask = atom(null, (get, set, projectId) => {
  const projects = get(projectsAtom);
  const groupData = { id: groupId++, groupName: "New Group", task: [] };
  const updatedProjects = projects.map((project) => {
    if (project.id === projectId) {
      return {
        ...project,
        grouptask: [...project.grouptask, groupData],
      };
    } else {
      return project;
    }
  });
  return set(projectsAtom, updatedProjects);
});

//function to update project
export const updateProject = atom(null, (get, set) => {
  const projects = get(projectsAtom);
});
export const addNewStatus = atom(null, (get, set, id, newStatus, newColor) => {
  const projects = get(projectsAtom);
  const newDefaultStatus = { id: statusId++, color: newColor, text: newStatus };

  const updatedProject = projects.map((project) => {
    if (project.id === id) {
      return {
        ...project,
        defaultStatus: [...project.defaultStatus, newDefaultStatus],
      };
    }
    return project;
  });
  set(projectsAtom, updatedProject);
  return newDefaultStatus;
});

//function to update groupName
export const updateGroupName = atom(
  null,
  (get, set, { projectId, groupId, newGroupName }) => {
    const projects = get(projectsAtom);
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
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
    return set(projectsAtom, updatedProjects);
  }
);

//function to update tabledata
export const updateGroupData = atom(
  null,
  (get, set, projectId, groupId, data, type) => {
    const projects = get(projectsAtom);
    console.log("GroupData: ", data);
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
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
                  id: taskid++,
                  item: "New Task",
                  processors: [],
                  status: { id: statusId++, color: "gray", text: "" },
                  date: "",
                  dateCompleted: "",
                  managers: [],
                  remarks: "",
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
    set(projectsAtom, updatedProjects);
    const updatedProject = updatedProjects.find(
      (project) => project.id === projectId
    );
    const updatedGroupTask = updatedProject.grouptask.find(
      (groupTask) => groupTask.id === groupId
    );

    return updatedGroupTask.task;
  }
);
