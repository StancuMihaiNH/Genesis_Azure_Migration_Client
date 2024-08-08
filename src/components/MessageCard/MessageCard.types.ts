import { Message, User } from "@/graphql/__generated__/schema";

export interface IMessageCardProps {
    topicId: string;
    message: Message;
    containerRef: React.RefObject<HTMLDivElement>;
    onRefetch?: () => void;
    handleResend: () => void;
    viewer?: User | null;
};