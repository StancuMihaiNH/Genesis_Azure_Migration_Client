import { AppContext } from "@/context";
import classNames from "classnames";
import { useContext } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { IToggleSidebarButtonProps } from "./ToggleSidebarButton.types";

const ToggleSidebarButton = (props: IToggleSidebarButtonProps) => {
  const { sidebarIsOpen, toggleSidebar } = useContext(AppContext);
  return (
    <button
      type={"button"}
      onClick={toggleSidebar}
      className={classNames(props.className, {
        hidden: !props.alwaysVisible && sidebarIsOpen,
      })}
    >
      <RiMenu2Fill size={24} />
    </button>
  );
};

export default ToggleSidebarButton;