"use client";
import React, { useEffect } from "react";

import Sidebar from "./components/sidebar";
import Content from "./components/content";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "../../src/amplifyconfiguration.json";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { getProjects, registerUser } from "./datastore";
import { useSetAtom } from "jotai";
Amplify.configure(config);


const Homepage = () => {
  const registerU = useSetAtom(registerUser);
  const getWorkSpaceData = useSetAtom(getProjects);
  useEffect(() => {
    const handleSignin = async () => {
      try {
        const result = await registerU();
        if (result.success) {
          console.log("User registered successfully");
        } else {
          console.error("User registration failed:", result.message);
        }
      } catch (error) {
        console.error("Error registering user:", error);
      }
    };
    const fetchWorkSpace = async () => {
      try {
        await getWorkSpaceData();
      } catch (error) {
        console.log(error);
      }
    };
    handleSignin();
    fetchWorkSpace();
  }, []);

  return (
    <Authenticator>
      <div className='flex flex-row w-full h-screen max-h-screen'>
        <Sidebar />
        <Content />
      </div>
    </Authenticator>
  );
};

export default withAuthenticator(Homepage);
