import { Prompt } from "@/graphql/__generated__/schema";

export interface IComposeInputProps {
    isSending?: boolean;
    onSend: (message: string, files?: File[]) => void;
    selectedModel: string;
    onModelChange: (model: string) => void;
    prompts: Prompt[];
    onStopStream?: () => void;
};