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
  { id: statusId++, color: "bg-orange-500", text: "Woring On It" },
  { id: statusId++, color: "bg-red-500", text: "Stuck" },
  { id: statusId++, color: "bg-violet-500", text: "Future Steps" },
  { id: statusId++, color: "bg-blue-500", text: "On Hold" },
  { id: statusId++, color: "bg-gray-500", text: "None" },
];
export const projectsAtom = atom([
  {
    id: projectid++,
    name: "Project 1",
    type: "shared",
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
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
              {
                sub: "sad786213",
                name: "Chloe Lazaro",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            status: { id: statusId++, color: "gray-500", text: "None" },
            date: new Date("2024/05/13"),
            deadline: new Date("2024/05/13"),
            dateCompleted: new Date("2024/05/13"),
            managers: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            remarks: "Completed",
          },
          {
            id: taskid++,
            item: "Task 2",
            processors: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            status: { id: statusId++, color: "red-500", text: "Stuck" },
            date: "",
            deadline: new Date("2024/05/13"),
            dateCompleted: "",
            managers: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            remarks: "Compl sadsadeted",
          },
          {
            id: taskid++,
            item: "Task 3",
            processors: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            status: { id: statusId++, color: "gray", text: "" },
            date: "",
            deadline: new Date("2024/05/13"),
            dateCompleted: "",
            managers: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
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
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            status: { id: statusId++, color: "gray", text: "" },
            date: "",
            deadline: "",
            dateCompleted: "",
            managers: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            remarks: "Complet asd saded",
          },
          {
            id: taskid++,
            item: "Task 2",
            processors: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            status: { id: statusId++, color: "gray", text: "" },
            date: "",
            deadline: "",
            dateCompleted: "",
            managers: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            remarks: "Compl sads asd asdadeted",
          },
          {
            id: taskid++,
            item: "Task 3",
            processors: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
              },
            ],
            status: { id: statusId++, color: "gray", text: "" },
            date: "",
            deadline: "",
            dateCompleted: "",
            managers: [
              {
                sub: "sad786213",
                name: "Axel Cortez",
                email: "john.cortez@aretex.com.au",
                picture: "",
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
  const newProject = {
    id: projectid++,
    name: title,
    type: privacy,
    grouptask: [],
  };
  console.log(newProject);
  return set(projectsAtom, [...prevProject, newProject]);
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
