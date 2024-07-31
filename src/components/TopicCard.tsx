"use client";
import DropDown from "@/components/DropDown";
import { DATE_TIME_FORMAT } from "@/constants";
import { Topic } from "@/graphql/__generated__/schema";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import classNames from "classnames";
import { format, fromUnixTime } from "date-fns";
import React from "react";
import { BsPin, BsThreeDotsVertical } from "react-icons/bs";

const TopicCard: React.FC<{
  topic: Topic;
  isActive?: boolean;
  onDelete?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onConversationClick?: () => void;
}> = ({ onConversationClick, topic, isActive, onDelete, onUnpin, onPin }) => {
  return (
    <div
      onClick={onConversationClick}
      key={`topic-${topic.id}`}
      className={classNames(
        "group/item rounded p-2 cursor-pointer border-2 flex flex-col gap-2 shadow-md transition-all duration-200 ease-in-out hover:bg-white",
        {
          "outline-none border-2 border-[#039fb8] bg-gray-50": isActive,
          "border-transparent bg-gray-200": !isActive,
        },
      )}
    >
      <div className={"flex justify-between items-center"}>
        <div className={"flex items-center gap-2"}>
          {topic.pinned && <BsPin />}
          <span className={"text-[#132e53] font-semibold"}>
            {topic.name || topic.aiTitle || "New Conversation"}
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
                if (topic.pinned) {
                  onUnpin?.();
                } else {
                  onPin?.();
                }
              }}
              className="cursor-pointer text-gray-900 text-sm bg-white p-2 hover:bg-gray-100 outline-0 border-0 rounded"
            >
              {topic.pinned ? "Unpin" : "Pin to top"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onDelete?.();
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
            fromUnixTime(topic.lastMessageAt ?? topic.createdAt ?? 0),
            DATE_TIME_FORMAT,
          )}
        </span>
      </p>
    </div>
  );
};

export default TopicCard;
