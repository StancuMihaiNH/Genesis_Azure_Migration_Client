import { Message } from "@/graphql/__generated__/schema";

export type FormValue = {
    content: string;
};

export interface IEditMessageProps {
    topicId: string;
    message: Message;
    onClose: () => void;
    onRefetch?: () => void;
};