"use client";
import Sidebar from "@/components/sidebar";
import AppProvider, { AppContext } from "@/context";
import GraphQLProvider from "@/graphql/client";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";

const RenderedApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sidebarIsOpen } = useContext(AppContext);
  return (
    <div className={classNames("min-h-screen", {
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
  const patname = usePathname();
  const excludePaths = ["/login"];
  return (
    <GraphQLProvider>
      <AppProvider>
        {!excludePaths.includes(patname) ? (
          <RenderedApp>{children}</RenderedApp>) : (
          children
        )}
      </AppProvider>
    </GraphQLProvider>
  );
};

export default Layout;