"use client";
import React, { useEffect } from "react";

import Sidebar from "./components/sidebar";
import Content from "./components/content";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "../../src/amplifyconfiguration.json";
Amplify.configure(config);

const Homepage = () => {
  // const registerU = useSetAtom(registerUser);
  // console.log(user);
  // useEffect(() => {
  //   const handleSignin = async () => {
  //     if (user) {
  //       try {
  //         const result = await registerU();
  //         if (result.success) {
  //           console.log("User registered successfully");
  //         } else {
  //           console.error("User registration failed:", result.message);
  //         }
  //       } catch (error) {
  //         console.error("Error registering user:", error);
  //       }
  //     }
  //   };
  //   handleSignin();
  // }, [user]);

  return (
    <Authenticator>
      <div className='flex flex-row w-full h-screen max-h-screen'>
        <Sidebar />
        <Content />
      </div>
    </Authenticator>
  );
};

export default Homepage;
