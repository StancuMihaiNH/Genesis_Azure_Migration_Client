"use client";
import DropDown from "@/components/DropDown/DropDown";
import { DATE_TIME_FORMAT } from "@/constants";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import classNames from "classnames";
import { format, fromUnixTime } from "date-fns";
import { BsPin, BsThreeDotsVertical } from "react-icons/bs";
import { ITopicCardProps } from "./TopicCard.types";

const TopicCard = (props: ITopicCardProps): JSX.Element => {
  return (
    <div
      onClick={props.onConversationClick}
      key={`topic-${props.topic.id}`}
      className={classNames(
        "group/item rounded p-2 cursor-pointer border-2 flex flex-col gap-2 shadow-md transition-all duration-200 ease-in-out hover:bg-white",
        {
          "outline-none border-2 border-[#039fb8] bg-gray-50": props.isActive,
          "border-transparent bg-gray-200": !props.isActive,
        },
      )}
    >
      <div className={"flex justify-between items-center"}>
        <div className={"flex items-center gap-2"}>
          {props.topic.pinned && <BsPin />}
          <span className={"text-[#132e53] font-semibold"}>
            {props.topic.name || props.topic.aiTitle || "New Conversation"}
          </span>
        </div>
        <div
          className={
            "invisible group-hover/item:visible transition-all duration-300 ease-in-out"
          }
        >
          <DropDown
            trigger={
              <button className={"p-2"}>
                <BsThreeDotsVertical />
              </button>
            }
          >
            <DropdownMenuItem
              onClick={() => {
                if (props.topic.pinned) {
                  props.onUnpin?.();
                } else {
                  props.onPin?.();
                }
              }}
              className="cursor-pointer text-gray-900 text-sm bg-white p-2 hover:bg-gray-100 outline-0 border-0 rounded"
            >
              {props.topic.pinned ? "Unpin" : "Pin to top"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(): void => {
                props.onDelete?.();
              }}
              className="cursor-pointer text-gray-900 text-sm bg-white p-2 hover:bg-gray-100 outline-0 border-0 rounded"
            >
              Delete
            </DropdownMenuItem>
          </DropDown>
        </div>
      </div>
      <p className={"flex flex-row justify-between text-xs text-[#132e53]"}>
        <span>
          {format(
            fromUnixTime(props.topic.lastMessageAt ?? props.topic.createdAt ?? 0),
            DATE_TIME_FORMAT
          )}
        </span>
      </p>
    </div>
  );
};

export default TopicCard;