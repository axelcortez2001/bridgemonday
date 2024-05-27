import { get, post, del, put } from "aws-amplify/api";

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
    const insertOperation = post({
      apiName: "mondayREST",
      path: path,
      options: {
        body: { workspaceData },
      },
    });
    const { body } = await insertOperation.response;
    console.log("All Workspace: ", body.json());
    return await body.json();
  } catch (e) {
    console.log(e);
  }
};
//function to delete workspace
export const deleteWorkSpace = async (path, id) => {
  try {
    console.log("ID: ", id);
    const deleteOperation = del({
      apiName: "mondayREST",
      path: path,
      options: {
        queryParams: { id },
      },
    });
    const { body } = await deleteOperation.response;
    return await body.json();
  } catch (error) {
    console.log(error);
  }
};
//funtion to edit workspace
export const editWorkSpace = async (path, id, title, privacy) => {
  try {
    console.log(id);
    const editOperation = put({
      apiName: "mondayREST",
      path: path,
      options: {
        body: { id, title, privacy },
      },
    });
    const { body } = await editOperation.response;
    return await body.json();
  } catch (error) {
    console.log(error);
  }
};
//function to add new grouptask
export const addNewGrouptask = async (path, id, groupData) => {
  try {
    const insertOperation = put({
      apiName: "mondayREST",
      path: path,
      options: {
        body: { id, groupData },
      },
    });
    const { body } = await insertOperation.response;
    return await body.json();
  } catch (error) {
    console.log(error);
  }
};

//function to update the whole project
export const updateWholeWorkSpace = async (path, workData) => {
  try {
    const replaceOperation = put({
      apiName: "mondayREST",
      path: path,
      options: {
        body: { workData },
      },
    });
    const { body } = await replaceOperation.response;
    return await body.json();
  } catch (error) {
    console.log(error);
  }
};
