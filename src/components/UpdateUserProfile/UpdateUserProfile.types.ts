import { User } from "@/graphql/__generated__/schema";

export type FormValues = {
    name: string;
    email: string;
};

export interface IUpdateUserProfileProps {
    onCanceled?: () => void;
    onCompleted?: () => void;
    user: User;
};