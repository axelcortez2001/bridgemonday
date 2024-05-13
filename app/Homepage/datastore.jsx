import { atom } from "jotai";

let projectid = 0;
let groupId = 0;
let taskid = 0;
export const blankProject = atom([
  { id: projectid++, name: "New Group", grouptask: [] },
]);
export const projectsAtom = atom([
  {
    id: projectid++,
    name: "Project 1",
    privacy: "main",
    grouptask: [
      {
        id: groupId++,
        groupName: "Group 1",

        task: [
          {
            id: taskid++,
            item: "Task 1",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Completed",
          },
          {
            id: taskid++,
            item: "Task 2",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Compl sadsadeted",
          },
          {
            id: taskid++,
            item: "Task 3",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Comfdsapleted ",
          },
        ],
      },
      {
        id: groupId++,
        groupName: "Group 2",
        tasks: [
          {
            id: taskid++,
            item: "Task 1",
            developers: [],
            status: "DOne",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Complet asd saded",
          },
          {
            id: taskid++,
            item: "Task 2",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Compl sads asd asdadeted",
          },
          {
            id: taskid++,
            item: "Task 3",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Comfdsa asdasd pleted ",
          },
        ],
      },
    ],
  },
  {
    id: projectid++,
    name: "Project 2",
    privacy: "private",
    grouptask: [
      {
        id: groupId++,
        groupName: "Group 1",
        task: [
          {
            id: taskid++,
            item: "Task 1",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Completed",
          },
          {
            id: taskid++,
            item: "Task 2",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Compl sadsadeted",
          },
          {
            id: taskid++,
            item: "Task 3",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Comfdsapleted ",
          },
        ],
      },
      {
        id: groupId++,
        groupName: "Group 2",
        tasks: [
          {
            id: taskid++,
            item: "Task 1",
            developers: [],
            status: "DOne",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Complet asd saded",
          },
          {
            id: taskid++,
            item: "Task 2",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
            remarks: "Compl sads asd asdadeted",
          },
          {
            id: taskid++,
            item: "Task 3",
            developers: [],
            status: "Completed",
            date: "2024-05-13T12:00:00",
            dateCompleted: "2024-05-13T12:00:00",
            supervisor: "",
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
    privacy: privacy,
    grouptask: [],
  };
  console.log(newProject);
  return set(projectsAtom, [...prevProject, newProject]);
});

//function to update project
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
