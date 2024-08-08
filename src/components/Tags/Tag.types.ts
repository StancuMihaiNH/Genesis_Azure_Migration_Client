import { Category, Tag, User } from "@/graphql/__generated__/schema";

export type Section = {
    id: string;
    category: Category;
    tags: Tag[];
};

export interface ITagsProps {
    selectedTags?: Tag[];
    onSelectTag?: (tag: Tag) => void;
    onRemoveTag?: (tag: Tag) => void;
    isAdmin?: boolean;
    viewer?: User | null;
};