"use client";
import React, { useEffect } from "react";
import Sidebar from "./components/sidebar";
import Content from "./components/content";
import { useSetAtom } from "jotai";
import { registerUser } from "./datastore";

const Homepage = ({ user }) => {
  const registerU = useSetAtom(registerUser);
  console.log(user);
  useEffect(() => {
    const handleSignin = async () => {
      if (user) {
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
      }
    };
    handleSignin();
  }, [user]);
  return (
    <div className='flex flex-row w-full h-screen max-h-screen'>
      <Sidebar />
      <Content />
    </div>
  );
};

export default Homepage;
