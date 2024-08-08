import { User, UserRole } from "@/graphql/__generated__/schema";

export type FormValues = {
    name: string;
    role: UserRole;
};

export interface IEditUserFormProps {
    onCompleted?: () => void;
    user: User;
};