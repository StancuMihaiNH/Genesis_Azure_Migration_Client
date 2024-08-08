import { BsFileText, BsFiletypePdf, BsFileWord } from "react-icons/bs";
import { IFileIconProps } from "./FileIcon.types";

const FileIcon = (props: IFileIconProps): JSX.Element => {
  if (props.type === "application/pdf") {
    return <BsFiletypePdf size={24} />;
  }

  if (props.type === "application/msword") {
    return <BsFileWord size={24} />;
  }

  return <BsFileText size={24} />;
};

export default FileIcon;