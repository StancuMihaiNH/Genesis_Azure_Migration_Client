"use client";
import Sidebar from "@/components/Sidebar";
import AppProvider, { AppContext } from "@/context";
import GraphQLProvider from "@/graphql/client";
import { msalConfig } from "@/services/msalConfig";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { Authentication } from "./Authentication/authentication";

const RenderedApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarIsOpen } = useContext(AppContext);

  return (
    <div
      className={classNames("min-h-screen", {
        "pl-[320px]": sidebarIsOpen,
        "pl-0 max-w-full": !sidebarIsOpen,
      })}
    >
      <Sidebar />
      {children}
    </div>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>("");
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication | null>(null);

  const setAccessToken = (token: string): void => {
    setToken(token);
  };

  useEffect(() => {
    const instance = new PublicClientApplication(msalConfig);
    instance.initialize().then(() => {
      setMsalInstance(instance);
    }).catch(error => {
      console.error('Failed to initialize MSAL instance:', error);
    });
  }, []);

  return (
    <React.StrictMode>
      {msalInstance && (
        <MsalProvider instance={msalInstance}>
          <Authentication setAccessToken={setAccessToken}>
            <GraphQLProvider token={token}>
              <AppProvider>
                <RenderedApp>{children}</RenderedApp>
              </AppProvider>
            </GraphQLProvider>
          </Authentication>
        </MsalProvider>
      )}
    </React.StrictMode>
  );
};

export default Layout;