"use client";
import React, { useEffect } from "react";

import Sidebar from "./components/sidebar";
import Content from "./components/content";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "../../src/amplifyconfiguration.json";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import { registerUser } from "./datastore";
import { useSetAtom } from "jotai";
Amplify.configure(config);

const Homepage = () => {
  

  const registerU = useSetAtom(registerUser);
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
    handleSignin();
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
