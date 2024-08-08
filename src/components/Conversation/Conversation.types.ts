import { Tag } from "@/graphql/__generated__/schema";

export interface ITagSectionProps {
    category: string;
    tags: Tag[];
    onClick: (tag: Tag) => void;
};

export interface ITagContainerProps {
    text: string;
    description?: string;
    onRemove?: () => void;
};

export interface IConversationProps {
    className?: string;
    id: string;
};