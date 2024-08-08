import { Prompt } from "@/graphql/__generated__/schema";

export type FormValues = {
    title: string;
    description: string;
};

export interface IPromptsProps {
    prompts: Prompt[];
    onPromptSelect?: (prompt: string) => void;
};