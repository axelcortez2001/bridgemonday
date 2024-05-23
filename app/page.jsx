"use client";
import Homepage from "./Homepage/page";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import config from "../src/amplifyconfiguration.json";
Amplify.configure(config);

export default function Home() {
  return (
    <Authenticator>
      {({ signOut, user }) => {
        // Register user on sign-in

        return (
          <main>
            <div className='flex justify-center items-center w-full h-screen'>
              <Homepage user={user} />
            </div>
          </main>
        );
      }}
    </Authenticator>
  );
}
