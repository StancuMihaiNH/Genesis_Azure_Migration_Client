import { Category } from "@/graphql/__generated__/schema";

export type FormValues = {
    title: string;
    description: string;
    userId: string;
};

export interface IEditCategoryFormProps {
    category: Category;
    onDone?: () => void;
    canChangeOwner?: boolean;
};