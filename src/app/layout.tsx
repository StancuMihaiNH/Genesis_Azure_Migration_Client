"use client";

import { Authentication } from "@/components/Authentication/authentication";
import Layout from "@/components/Layout";
import { msalConfig } from "@/services/msalConfig";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import classNames from "classnames";
import { Inter } from "next/font/google";
import React, { useState } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const msalInstance = new PublicClientApplication(msalConfig);
  const [token, setToken] = useState<string>("");

  const setAccessToken = (token: string): void => {
    setToken(token);
  };

  return (
    <html lang="en">
      <body className={classNames(inter.className)}>
        <MsalProvider instance={msalInstance}>
          <Authentication setAccessToken={setAccessToken}>
            {token && <Layout>{children}</Layout>}
          </Authentication>
        </MsalProvider>
      </body>
    </html>
  );
};