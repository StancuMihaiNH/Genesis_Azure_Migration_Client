import { Topic } from "@/graphql/__generated__/schema";

export interface ITopicCardProps {
    topic: Topic;
    isActive?: boolean;
    onDelete?: () => void;
    onPin?: () => void;
    onUnpin?: () => void;
    onConversationClick?: () => void;
};