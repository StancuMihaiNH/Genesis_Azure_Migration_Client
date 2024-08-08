"use client";
import FileIcon from "@/components/FileIcon/FileIcon";
import Prompts from "@/components/Prompts/Prompts";
import EventEmitter, { EVENT } from "@/events";
import { Prompt } from "@/graphql/__generated__/schema";
import { models } from "@/Models";
import { ElementProps, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import classNames from "classnames";
import React, { DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { BsMagic, BsPaperclip, BsX } from "react-icons/bs";
import { FiArrowUp } from "react-icons/fi";
import { RiRobot3Line } from "react-icons/ri";
import TextareaAutosize from "react-textarea-autosize";
import { IComposeInputProps } from "./ComposeInput.types";

const ComposeInput = (props: IComposeInputProps) => {
  const [showPrompts, setShowPrompts] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState<string>("");
  const fileRef: React.RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const inputRef: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);
  const [isOpenModelPicker, setIsOpenModelPicker] = useState<boolean>(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpenModelPicker,
    onOpenChange: setIsOpenModelPicker,
    placement: "top-start"
  });

  const click: ElementProps = useClick(context);
  const dismiss: ElementProps = useDismiss(context);
  const { getReferenceProps } = useInteractions([click, dismiss]);

  useEffect((): void => {
    if (input.startsWith("/")) {
      setShowPrompts(true);
      return;
    }

    setShowPrompts(false);
  }, [input]);

  useEffect((): void => {
    EventEmitter.subscribe(EVENT.VALUE_CHANGE, (str: string) => {
      setInput(str);
    });
  }, []);

  const handleSend = async (): Promise<void> => {
    if (props.isSending) {
      props.onStopStream?.();
      return;
    }

    props.onSend(input, files);
    setInput("");
    setFiles([]);
  };

  const filterPrompts: Array<Prompt> = useMemo(() => {
    const query: string = input.slice(1).toLowerCase();
    return props.prompts.filter(
      (prompt) =>
        prompt.title?.toLowerCase().includes(query) ||
        prompt.description?.toLowerCase().includes(query)
    );
  }, [input, props.prompts]);

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles: Array<File> = Array.from(event.dataTransfer.files);
    const MAX_FILE_SIZE: number = 5 * 1024 * 1024;
    const allowExtensions: RegExp = /(\.pdf|\.doc|\.docx|\.txt)$/i;

    for (const file of droppedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Please upload files less than 5MB");
        return;
      }

      if (!allowExtensions.test(file.name)) {
        alert("Invalid file extension. Please upload only PDF, DOC, DOCX, or TXT files");
        return;
      }
    }
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const allowExtensions: RegExp = /(\.pdf|\.doc|\.docx|\.txt)$/i;
    const _files: Array<File> = Array.from(e.target.files || []);
    const MAX_FILE_SIZE: number = 5 * 1024 * 1024;

    for (const file of _files) {
      if (file.size > MAX_FILE_SIZE) {
        alert("File is too large. Please upload files less than 5MB");
        fileRef.current!.value = "";
        return;
      }

      if (!allowExtensions.test(file.name)) {
        alert("Invalid file extension. Please upload only PDF, DOC, DOCX, or TXT files");
        fileRef.current!.value = "";
        return;
      }
    }

    setFiles((prev): Array<File> => [...prev, ..._files]);
    fileRef.current!.value = "";
  };

  return (
    <>
      {showPrompts && (
        <div className="p-4 flex gap-4">
          <Prompts
            prompts={filterPrompts}
            onPromptSelect={(p) => {
              setInput(p);
              setShowPrompts(false);
            }}
          />
        </div>
      )}
      <div
        className="p-3 shadow border border-gray-200"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          disabled={props.isSending}
          className="hidden"
          multiple
          onChange={handleFileChange}
          type="file"
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          ref={fileRef}
        />
        <div className="pb-3 flex gap-3">
          {isOpenModelPicker && (
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="rounded py-2"
            >
              <div className="rounded bg-gray-100">
                {models.map((model, index) => (
                  <button
                    onClick={(): void => {
                      props.onModelChange(model.id);
                      setIsOpenModelPicker(false);
                    }}
                    key={model.id}
                    className={classNames(
                      "flex gap-4 items-center justify-between w-full p-2 hover:opacity-60",
                      {
                        "border-b border-gray-300": index !== models.length - 1,
                        "rounded-t-[10px]": index === 0,
                        "rounded-b-[10px]": index === models.length - 1,
                      }
                    )}
                  >
                    <span className="text-[#132e53] font-semibold text-sm">
                      {model.displayName}
                    </span>
                    <span
                      className={classNames(
                        "w-2 h-2 bg-[#039fb8] rounded-full",
                        {
                          "opacity-100": props.selectedModel === model.id,
                          "opacity-0": props.selectedModel !== model.id,
                        }
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
          <button
            ref={refs.setReference}
            {...getReferenceProps()}
            type="button"
            className="p-1 rounded-[10px] hover:bg-gray-200 text-[#132e53] bg-gray-100 gap-2 items-center px-2 inline-flex shadow overflow-x-hidden transition hover:delay-100"
          >
            <span className="w-5 h-5">
              <RiRobot3Line size={20} />
            </span>
            <span className="text-[#132e53] font-semibold text-sm">
              {props.selectedModel}
            </span>
          </button>
          <button
            onClick={() => {
              if (!showPrompts) {
                setInput("/");
                inputRef.current?.focus();
                return;
              }

              setInput("");
            }}
            type="button"
            className="p-1 rounded-[10px] hover:bg-gray-200 text-[#132e53] bg-gray-100 gap-2 items-center px-2 inline-flex shadow w-[35px] overflow-x-hidden transition hover:delay-100 hover:w-[100px]"
          >
            <span className="w-5 h-5">
              <BsMagic size={20} />
            </span>
            <span className="text-[#132e53] font-semibold text-sm">
              Prompts
            </span>
          </button>
        </div>
        <div className="shadow p-3 border-t flex flex-col gap-2 rounded-[10px]">
          {files.length > 0 && (
            <div className="flex flex-row gap-2 flex-wrap p-2">
              {files.map((file: File, index: number): JSX.Element => (
                <div
                  key={index}
                  className="flex items-center gap-2 border rounded p-2"
                >
                  <div className="bg-[#dee22a] text-white p-2 rounded">
                    <FileIcon type={file.type} />
                  </div>
                  <span className="text-sm">{file.name}</span>
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={(): void => {
                      setFiles((prev): Array<File> => prev.filter((_, i): boolean => i !== index));
                    }}
                  >
                    <BsX size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-1 items-end justify-end">
            <div className="flex flex-1 items-center gap-2">
              <button
                disabled={props.isSending}
                onClick={(): void => {
                  fileRef.current?.click();
                }}
                className="p-2 rounded-full hover:bg-gray-200 mr-2 text-[#132e53] disabled:opacity-50"
              >
                <BsPaperclip size={24} />
              </button>
              <TextareaAutosize
                id="new-message-textarea"
                ref={inputRef}
                placeholder="Type a message"
                className="flex-1 resize-none p-2 outline-0 text-[#132e53]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={async (e): Promise<void> => {
                  if (e.key === "Enter") {
                    if (e.shiftKey) {
                      return;
                    }

                    e.preventDefault();
                    await handleSend();
                  }
                }}
              />
            </div>
            {props.isSending
              ? <button onClick={(): void => { props.onStopStream?.(); }}
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white animate-pulse" />
              </button>
              : <button
                disabled={(!input && files.length === 0) || props.isSending}
                onClick={handleSend}
                className="rounded-full w-10 h-10 flex items-center justify-center bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-50"
              >
                <FiArrowUp size={24} />
              </button>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposeInput;