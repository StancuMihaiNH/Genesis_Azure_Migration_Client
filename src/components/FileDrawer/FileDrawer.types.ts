import { File as FileObj } from "@/graphql/__generated__/schema";

export interface IFileDrawerProps {
    file: FileObj;
    onClose: () => void;
};