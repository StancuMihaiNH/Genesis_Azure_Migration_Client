import { usePresignedUploadUrlMutation } from "@/graphql/__generated__/schema";

const uploadToBlobStorage = async (presignedUrl: string, file: File) => {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      'x-ms-blob-type': 'BlockBlob',
      'Content-Type': file.type,
    }
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload file: ${response.status} ${response.statusText} - ${errorText}`);
  }
};

const useUpload = () => {
  const [presigned, { loading }] = usePresignedUploadUrlMutation();

  const upload = async (file: File, prefix?: string) => {
    const { data } = await presigned({
      variables: {
        filename: file.name,
        contentType: file.type,
        prefix
      },
    });
    const { url, key } = data?.presignedUploadUrl || {};
    if (!url || !key) {
      throw new Error("Failed to get presigned URL");
    }
    await uploadToBlobStorage(url, file);
    return key;
  };

  return { upload };
};

export default useUpload;