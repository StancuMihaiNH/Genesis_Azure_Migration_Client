import { User } from "@/graphql/__generated__/schema";

export interface IAvatarProps {
    role: "assistant" | "user";
    user?: User | null;
}