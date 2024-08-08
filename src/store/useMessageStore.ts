import { Message, Tag } from "@/graphql/__generated__/schema";
import { Constants } from "@/utils/constants";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Snippet = {
  messageIndex: number;
  startCharacter: number;
  endCharacter: number;
};

export const handleSend = async (messages: Message[], model: string, tags?: Tag[], snippet?: Snippet): Promise<any> => {
  let payload: Payload[] = [];
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    if (message.files && message.files.length > 0) {
      for (let j = 0; j < message.files.length; j++) {
        const file = message.files[j];
        payload.push({
          role: message.role ?? undefined,
          content: `Please consider following contents in prepareing your response:
                ${file?.content}`,
        });
      }
    }

    if (message.content) {
      payload.push({ role: message.role ?? undefined, content: message.content });
    }
  }

  const body = {
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    model,
    messages: payload,
    tags: tags?.map((tag) => ({ id: tag.id, displayName: tag.displayName })),
    snippet
  };

  return await fetch(`${Constants.NEXT_PUBLIC_MESSAGE_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
};

type Payload = {
  role: "assistant" | "user" | undefined;
  content: string;
  files?: string[] | undefined;
};

interface MessageStore {
  selectedModel: string;
  onModelChange: (model: string) => void;
};

export type SendStreamPayload = {
  messages: Message[];
  model: string;
  tags?: Tag[];
  snippet?: Snippet;
};

export type GenerateAITitlePayload = {
  conversationId: string;
  messages: Message[];
  snippet?: Snippet;
};

export const handleGenerateAITitle = async (data: GenerateAITitlePayload, signal?: AbortSignal) => {
  let payload: Payload[] = [];
  for (let i: number = 0; i < data.messages.length; i++) {
    const message = data.messages[i];
    payload.push({
      role: message.role ?? undefined,
      content: message.content ?? "",
    });
  }

  const body = {
    conversationId: data.conversationId,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    model: "title",
    messages: payload,
    snippet: data.snippet,
  };

  const res: Response = await fetch(`${Constants.NEXT_PUBLIC_MESSAGE_API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    throw new Error("Failed to generate title");
  }

  const reader: ReadableStreamDefaultReader<Uint8Array> | undefined = res.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get reader");
  }

  const decoder: TextDecoder = new TextDecoder();
  let response = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    response += decoder.decode(value, { stream: true });
  }

  try {
    return JSON.parse(response);
  } catch (err) {
    return {};
  }
};

export const handleSendAndStreamCallback = async (data: SendStreamPayload, callback: (response: string, error?: any) => void, conversationId: string, signal?: AbortSignal) => {
  let payload: Payload[] = [];
  for (let i: number = 0; i < data.messages.length; i++) {
    const message = data.messages[i];
    payload.push({
      role: message.role ?? undefined,
      content: message.content ?? "",
      //@ts-ignore
      files: message.files?.map((item) => item?.id),
    });
  }

  const body = {
    conversationId,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    model: data.model,
    messages: payload,
    tags: data.tags?.map((tag) => ({ id: tag.id, displayName: tag.displayName })),
    snippet: data.snippet,
  };

  try {
    const res = await fetch(`${Constants.NEXT_PUBLIC_MESSAGE_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(body),
      signal
    });

    if (!res.ok) {
      callback("", "Failed to send message");
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      callback("", "Failed to get reader");
      return;
    }

    const decoder = new TextDecoder();
    const readStream = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        let text = decoder.decode(value, { stream: true });
        if (text.endsWith("\n")) {
          text = text.slice(0, -1);
          let arr = text.split("\n");
          arr = arr.map((item) => (item === "" ? "\n" : item));
          callback(arr.join(""));
          // callback(text.slice(0, -1));
        } else if (!text) {
          callback("\n");
        } else {
          callback(text);
        }
      }
    };
    await readStream();
    // if done then return callback with "__done__"
    callback("__done__");
  } catch (err: any) {
    console.log(err);
    if (err.name === "AbortError") {
      callback("__done__");
    } else {
      callback("", err);
    }
  }
};

const useMessageStore = create(
  persist<MessageStore>(
    (set, get) => ({
      selectedModel: "gpt-4",
      onModelChange: (model) => set({ selectedModel: model }),
    }),
    {
      name: "messenger-storage", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useMessageStore;