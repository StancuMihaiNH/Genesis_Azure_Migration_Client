import classNames from "classnames";
import React from "react";
import { RiClipboardLine } from "react-icons/ri";
import { ICopyProps } from "./Copy.types";

const Copy = (props: ICopyProps): JSX.Element => {
  const [showAnimation, setShowAnimation] = React.useState<boolean>(false);
  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(props.message);
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
  };

  return (
    <button
      className={classNames(
        "flex items-center gap-1 text-[#132e53] text-xs px-1 rounded-md border border-[#132e53] hover:bg-[#132e53] hover:text-white transition-all duration-200 ease-in-out shadow",
        props.className
      )}
      onClick={copyToClipboard}
    >
      <RiClipboardLine />
      {showAnimation ? "Copied!" : "Copy"}
    </button>
  );
};

export default Copy;