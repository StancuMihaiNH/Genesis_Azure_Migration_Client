"use client";
import React, { useEffect, useState } from "react";
import { IConfirmButtonProps } from "./ConfirmButton.types";

const ConfirmButton = (props: IConfirmButtonProps): JSX.Element => {
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  useEffect(() => {
    const handleClick = () => {
      if (isConfirming) {
        setIsConfirming(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [isConfirming]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    if (isConfirming) {
      props.onConfirm();
      setIsConfirming(false);
      return;
    }

    setIsConfirming(true);
  };

  return (
    <button onClick={handleClick} className={props.className}>
      {isConfirming ? props.confirmTitle : props.title}
    </button>
  );
};

export default ConfirmButton;