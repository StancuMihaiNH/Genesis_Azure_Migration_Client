import { useGetFileContentQuery } from "@/graphql/__generated__/schema";
import { IFileContentProps } from "./FileContent.types";

const FileContent = (props: IFileContentProps): JSX.Element => {
  const { data, loading } = useGetFileContentQuery({
    variables: {
      key: props.id
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div className={"whitespace-pre-line"}>{data?.getFileContent}</div>;
};

export default FileContent;