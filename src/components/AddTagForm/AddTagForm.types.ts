import { Category, Tag } from "@/graphql/__generated__/schema";

export interface IAddTagFormProps {
    categories: Category[];
    onAdded?: (tag: Tag) => void;
}

export type FormValues = {
    displayName: string;
    content: string;
    categoryId?: string;
};