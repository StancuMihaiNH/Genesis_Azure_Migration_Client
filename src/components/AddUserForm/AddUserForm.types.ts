import { User } from "@/graphql/__generated__/schema";

export interface IAddUserFormProps {
    onCompleted?: (user: User) => void;
}

export type FormValues = {
    name: string;
    email: string;
};