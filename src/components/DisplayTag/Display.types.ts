import { Tag } from "@/graphql/__generated__/schema";

export interface IDisplayProps {
    tag: Tag;
    selected?: boolean;
    onRemove?: (tag: Tag) => void;
    onSelected?: (tag: Tag) => void;
    canDelete?: boolean;
};