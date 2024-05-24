import { get } from "aws-amplify/api";
import { post } from "aws-amplify/api";

export async function getTodo() {
  try {
    const restOperation = get({
      apiName: "mondayREST",
      path: "/items",
    });
    const { body } = await restOperation.response;
    console.log("GET call succeeded: ", body.json());
    return await body.json();
  } catch (e) {
    console.log("GET call failed: ", JSON.parse(e.response.body));
  }
}
export async function getOne() {
  try {
    const restOperation = get({
      apiName: "mondayREST",
      path: "/user",
    });
    const { body } = await restOperation.response;
    console.log("GET call succeeded: ", body.json());
    return await body.json();
  } catch (e) {
    console.log("GET call failed: ", JSON.parse(e.response.body));
  }
}

//function to add newuser to db
export const restinsert = async (path, request) => {
  try {
    const insertOperation = post({
      apiName: "mondayREST",
      path: path,
      options: {
        body: request,
      },
    });
    const { body } = await insertOperation.response;
    console.log("body", body.json());
    return await body.json();
  } catch (e) {
    console.log(e);
  }
};
//function to get all users
export const getAllUsers = async (path) => {
  try {
    const getOperation = get({
      apiName: "mondayREST",
      path: path,
    });
    const { body } = await getOperation.response;
    console.log("All Users: ", body.json());
    return await body.json();
  } catch (e) {
    console.log(e);
  }
};

//function to get all workspace
export const getWorkspace = async (path) => {
  try {
    const getOperation = get({
      apiName: "mondayREST",
      path: path,
    });
    const { body } = await getOperation.response;
    console.log("All Workspace: ", body.json());
    return await body.json();
  } catch (e) {
    console.log(e);
  }
};
//function to add new Poject
export const addWorkspace = async (path, workspaceData) => {
  try {
    console.log("Path: ", path);
    console.log("Workspace: ", workspaceData);
    const insertOperation = post({
      apiName: "mondayREST",
      path: path,
      options: {
        body: { workspaceData },
      },
    });
    const { body } = await insertOperation.response;
    return await body.json();
  } catch (e) {
    console.log(e);
  }
};
