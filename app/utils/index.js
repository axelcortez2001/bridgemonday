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

// try {
//   const insertOperation = post({
//     apiName: "bridgeApi",
//     path: path,
//     options: {
//       queryParams: query,
//       body: request,
//     },
//   });

//   const { body } = await insertOperation.response;
//   return await body.json();
// } catch (error) {
//   console.log(error);
// }
