/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require("express");
const bodyParser = require("body-parser");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

//connect to mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "MondayBridge",
});

const workspaceSchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String, required: true },
  defaultStatus: [],
  defaultDropDown: [],
  columns: [],
  subColumns: [],
  organizer: [],
  grouptask: [],
});
const workspaceModel = mongoose.model("workspace", workspaceSchema);

/**********************
 * Example get method *
 **********************/

app.get("/modaydata", async (req, res) => {
  try {
    const { sub } = req.query;
    const workspaceData = await workspaceModel.find();
    if (!workspaceData) {
      return res.status(404).json({ message: "WorkSpace Unavailable" });
    }
    if (sub) {
      const workspace = workspaceData.filter((space) =>
        space?.organizer?.some((person) => person?.sub === sub)
      );
      res.status(200).json({ success: true, workspace });
    } else {
      res.status(404).json({ success: false, message: "WorkSpace Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/modaydata/*", function (req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/
//add new Project to workspace
app.post("/modaydata", async (req, res) => {
  const { workspaceData } = req.body;
  try {
    const workspace = new workspaceModel(workspaceData);
    await workspace.save();
    res.status(200).json({ success: true, workspace });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/modaydata/*", function (req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/
//update project data, title and type
app.put("/modaydata", async (req, res) => {
  const { id, title, privacy } = req.body;
  try {
    const project = await workspaceModel.findByIdAndUpdate(id, {
      name: title,
      type: privacy,
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
//function to update all projectData
app.put("/modaydata/update", async (req, res) => {
  const { workData } = req.body;
  try {
    const bulkOperations = workData.map((data) => ({
      updateOne: {
        filter: { _id: data._id },
        update: { $set: data },
        upsert: true,
      },
    }));
    // Update Data
    const newProjects = await workspaceModel.bulkWrite(bulkOperations);
    res.status(200).json({ success: true, newProjects });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/modaydata/grouptask", async (req, res) => {
  const { id, groupData } = req.body;
  try {
    const project = await workspaceModel.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    project.grouptask.push(groupData);
    await project.save();
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/****************************
 * Example delete method *
 ****************************/
//delete project
app.delete("/modaydata", async (req, res) => {
  const { id } = req.query;
  try {
    const deleted = await workspaceModel.deleteOne({ _id: id });
    if (!deleted) {
      return res.status(404).json({ error: "ID not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/modaydata/*", function (req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
