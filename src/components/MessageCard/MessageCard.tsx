"use client";
import Avatar from "@/components/Avatar/Avatar";
import Copy from "@/components/Copy/Copy";
import EditMessage from "@/components/EditMessage/EditMessage";
import FileDrawer from "@/components/FileDrawer/FileDrawer";
import FileIcon from "@/components/FileIcon/FileIcon";
import MessageSelection from "@/components/MessageSelection/MessageSelection";
import Modal from "@/components/Modal/Modal";
import { DATE_TIME_FORMAT } from "@/constants";
import { File as FileObj } from "@/graphql/__generated__/schema";
import { getModelName } from "@/Models";
import classNames from "classnames";
import { format, fromUnixTime } from "date-fns";
import { marked } from "marked";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RiEditBoxLine, RiErrorWarningLine, RiRobot3Line } from "react-icons/ri";
import { IMessageCardProps } from "./MessageCard.types";

const process = (txt: string): string => {
  const regex: RegExp = /^\[.*?}(?=])/;
  const match: RegExpMatchArray | null = txt.match(regex);
  if (match && match[0]) {
    return txt.replace(`${match[0]}]`, "");
  }

  return txt;
};

const MessageCard = (props: IMessageCardProps): JSX.Element => {
  const [file, setFile] = useState<FileObj>();
  const [showEdit, setShowEdit] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  //const { rewriteMessage } = useMessageStore();
  const handleRewrite = (start: number, end: number) => {
    // rewriteMessage(topicId, message.id, start, end);
  };

  return (
    <>
      <div
        className={classNames("flex flex-col gap-2  p-4 group/item", {
          "items-start": props.message.role === "assistant",
          "items-end": props.message.role === "user",
        })}
      >
        <Avatar user={props.viewer} role={props.message.role ?? "user"} />
        <div
          className={classNames("flex flex-col", {
            "items-start": props.message.role === "assistant",
            "items-end": props.message.role === "user",
          })}
        >
          <div
            ref={ref}
            className={"message-card text-[#132e53] text-lg overflow-x-auto"}
            dangerouslySetInnerHTML={{
              __html: marked(process(props.message?.content || "")),
            }}
          />
          {props.message.files && props.message.files.length > 0 && (
            <div className={"flex flex-row gap-2 flex-wrap py-2"}>
              {props.message.files?.map((file, index) => (
                <button
                  onClick={() => setFile(file as FileObj)}
                  type={"button"}
                  key={index}
                  className={
                    "flex items-center gap-2 border rounded p-2 text-[#132e53]"
                  }
                >
                  <div className={"bg-[#dee22a] text-white p-2 rounded"}>
                    <FileIcon type={file?.contentType ?? ""} />
                  </div>
                  {file?.filename}
                </button>
              ))}
            </div>
          )}
          <div className={"text-[12px] flex items-center gap-2"}>
            <p>{format(fromUnixTime(props.message.createdAt ?? 0), DATE_TIME_FORMAT)}</p>

            {props.message.role === "assistant" && (
              <div
                className={
                  "flex items-center gap-1 text-xs px-1 rounded-md border border-[#132e53] bg-[#132e53] text-white transition-all duration-200 ease-in-out shadow"
                }
              >
                <RiRobot3Line />
                {getModelName(props.message.model || "gpt-4")}
              </div>
            )}
          </div>
          {props.message.sourceDocuments && props.message.sourceDocuments.length > 0 && (
            <>
              <h4 className="font-bold mt-4">Citations:</h4>
              <div className={"flex flex-row gap-2 flex-wrap py-2"}>
                {props.message.sourceDocuments?.map((file, index) => (
                  <div
                    key={index}
                    className={
                      "flex-row items-center gap-2 border rounded p-2 text-[#132e53]"
                    }
                  >
                    <div
                      className={
                        "bg-white text-[#1a243b] italic text-sm p-2 rounded mb-2"
                      }
                    >
                      <span>{file?.filename}</span>
                    </div>
                    <div className="px-4 break-all">{file?.content}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          {props.message.localStatusError && (
            <div className={"flex items-center"}>
              <button
                onClick={props.handleResend}
                className={"p-2 flex  items-center gap-1 text-red-500 text-sm"}
              >
                <RiErrorWarningLine size={20} className={"text-red-500"} />
                Resend
              </button>
            </div>
          )}
          <div
            className={
              "flex items-center gap-2 mt-2 invisible group-hover/item:visible"
            }
          >
            <Copy message={props.message.content ?? ""} />
            {props.message.role === "user" && (
              <button
                onClick={() => setShowEdit(true)}
                className={classNames(
                  "flex items-center gap-1 text-[#132e53] text-xs px-1 rounded-md border border-[#132e53] hover:bg-[#132e53] hover:text-white transition-all duration-200 ease-in-out shadow",
                )}
              >
                <RiEditBoxLine /> Edit
              </button>
            )}
          </div>
        </div>
      </div>
      <Modal
        title={"Edit message"}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      >
        <EditMessage
          onRefetch={props.onRefetch}
          topicId={props.topicId}
          onClose={() => setShowEdit(false)}
          message={props.message}
        />
      </Modal>
      {props.message.role === "assistant" && (
        <MessageSelection
          onRewrite={handleRewrite}
          containerRef={props.containerRef}
          parentRef={ref}
        />
      )}
      {file &&
        createPortal(
          <FileDrawer file={file} onClose={() => setFile(undefined)} />,
          document.body,
        )}
    </>
  );
};

export default MessageCard;