import { atom, selector } from "jotai";

export const pendingStatusAtom = [
  {
    id: 1,
    item: "Aretex bridge",
    supervisor: "",
    developers: [],
    status: "Pending",
    date: "2021-09-01",
    dateCompleted: "2021-09-01",
    remarks: "On Going",
  },
  {
    id: 2,
    item: "Aretex Secret",
    supervisor: "",
    developers: [],
    status: "Pending",
    date: "2021-09-01",
    dateCompleted: "2021-09-01",
    remarks: "On Going",
  },
];

export const ongoingStatusAtom = [];
export const completedStatusAtom = [
  {
    id: 1,
    item: "Aretex bridge",
    supervisor: "",
    developers: [],
    status: "Completed",
    date: "2021-09-01",
    dateCompleted: "2021-09-01",
    remarks: "Completed",
  },
];
export const forReviewStatusAtom = [];
export const deployedStatusAtom = [];
export const ceasedStatusAtom = [];

// Combine status atoms into a single array
export const allStatusesAtom = [
  pendingStatusAtom,
  ongoingStatusAtom,
  completedStatusAtom,
  forReviewStatusAtom,
  deployedStatusAtom,
  ceasedStatusAtom,
];

// Define an atom for each project
export const projectsAtom = atom([
  {
    id: 1,
    projectTitle: "Innovation Projects",
    pending: pendingStatusAtom,
    ongoing: ongoingStatusAtom,
    completed: completedStatusAtom,
    forReview: forReviewStatusAtom,
    deployed: deployedStatusAtom,
    ceased: ceasedStatusAtom,
    dateCreated: "2021-09-01",
  },
  {
    id: 2,
    projectTitle: "Monday Projects",
    pending: pendingStatusAtom,
    ongoing: ongoingStatusAtom,
    completed: completedStatusAtom,
    forReview: forReviewStatusAtom,
    deployed: deployedStatusAtom,
    ceased: ceasedStatusAtom,
    dateCreated: "2021-09-01",
  },
]);
export const selectedProject = atom(1);
export const selectedProjectDataAtom = atom((get, set) => {
  const projects = get(projectsAtom);
  const selectedProjectId = get(selectedProject);
  console.log("Project", projects);
  return projects.find((project) => project.id === selectedProjectId);
});
