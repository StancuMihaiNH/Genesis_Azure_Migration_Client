import React, { createContext, useState } from "react";
export type AppContextType = {
  search: string | undefined;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  topicFilterPin: boolean;
  setTopicFilterPin: React.Dispatch<React.SetStateAction<boolean>>;
  topicFilterSortAsc: boolean;
  setTopicFilterSortAsc: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarIsOpen: boolean;
  toggleSidebar: () => void;
};

export const AppContext = createContext<AppContextType>({
  search: undefined,
  topicFilterPin: false,
  setTopicFilterPin: () => { },
  topicFilterSortAsc: false,
  setTopicFilterSortAsc: () => { },
  setSearch: () => { },
  sidebarIsOpen: true,
  toggleSidebar: () => { },
});

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topicFilterPin, setTopicFilterPin] = useState(false);
  const [topicFilterSortAsc, setTopicFilterSortAsc] = useState(false);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);
  const toggleSidebar = (): void => {
    setSidebarIsOpen((pre: boolean): boolean => !pre);
  };

  return (
    <AppContext.Provider
      value={{
        topicFilterPin,
        setTopicFilterPin,
        topicFilterSortAsc,
        setTopicFilterSortAsc,
        search,
        setSearch,
        sidebarIsOpen,
        toggleSidebar
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;