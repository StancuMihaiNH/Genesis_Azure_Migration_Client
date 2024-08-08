import { Category, Tag } from "@/graphql/__generated__/schema";

export type FormValues = {
    displayName: string;
    content: string;
    categoryId?: string;
    userId?: string;
};

export interface IEditTagFormProps {
    tag: Tag;
    categories: Category[];
    oneDone?: () => void;
    canChangeOwner?: boolean;
};