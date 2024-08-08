"use client";
import Copy from "@/components/Copy/Copy";
import EventEmitter, { EVENT } from "@/events";
import useTextSelection from "@/hooks/useTextSelection";
import { createPortal } from "react-dom";
import { RiRefreshFill } from "react-icons/ri";
import { IMessageSelectionProps } from "./MessageSelection.types";

const MessageSelection = (props: IMessageSelectionProps) => {
  const { clientRect, start, end, isCollapsed, textContent, showSelection } = useTextSelection(props.containerRef.current!, props.parentRef.current!);
  if (!clientRect || isCollapsed) {
    return null;
  }

  let left = clientRect.left;
  if (left < 0) {
    left += 40;
  }

  if (left + 200 > window.innerWidth) {
    left -= 150;
  }

  return createPortal(
    <div className={"flex items-center gap-2"}
      style={{
        position: "absolute",
        top: `${clientRect?.top - 30}px`,
        left: `${left}px`,
        height: clientRect?.height,
      }}>
      <Copy className={"bg-white"} message={textContent ?? ""} />
      <button onClick={(): void => {
        if (!textContent) {
          alert("Please select text to rewrite");
          return;
        }

        EventEmitter.dispatch(EVENT.VALUE_CHANGE, textContent);
      }}
        className="bg-white flex items-center gap-1 text-[#132e53] text-xs px-1 rounded-md border border-[#132e53] hover:bg-[#132e53] hover:text-white transition-all duration-200 ease-in-out shadow" >
        <RiRefreshFill />
        Rewrite
      </button>
    </div>,
    document.body
  );
};

export default MessageSelection;