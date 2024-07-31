import { AppContext } from "@/context";
import classNames from "classnames";
import React, { useContext } from "react";
import { RiMenu2Fill } from "react-icons/ri";

const ToggleSidebarButton: React.FC<{
  alwaysVisible?: boolean;
  className?: string;
}> = ({ alwaysVisible, className }) => {
  const { sidebarIsOpen, toggleSidebar } = useContext(AppContext);
  return (
    <button
      type={"button"}
      onClick={toggleSidebar}
      className={classNames(className, {
        hidden: !alwaysVisible && sidebarIsOpen,
      })}
    >
      <RiMenu2Fill size={24} />
    </button>
  );
};

export default ToggleSidebarButton;
