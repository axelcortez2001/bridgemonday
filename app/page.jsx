"use client";
import Homepage from "./Homepage/page";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "../src/amplifyconfiguration.json";
import { useAtom, useSetAtom } from "jotai";
import { registerUser } from "./Homepage/datastore";
Amplify.configure(config);

export default function Home() {
  const registerU = useSetAtom(registerUser);
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
  return (
    <Authenticator>
      {({ signOut, user }) => {
        // Register user on sign-in
        if (user) {
          handleSignin();
        }
        return (
          <main>
            <div className='flex justify-center items-center w-full h-screen'>
              <Homepage />
            </div>
          </main>
        );
      }}
    </Authenticator>
  );
}
