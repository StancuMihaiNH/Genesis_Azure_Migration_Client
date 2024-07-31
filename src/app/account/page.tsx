"use client";
import ToggleSidebarButton from "@/components/ToggleSidebarButton";
import UpdateUserProfile from "@/components/UpdateUserProfile";
import {
  useUpdateUserMutation,
  useViewerQuery,
} from "@/graphql/__generated__/schema";
import useUpload from "@/hooks/useUpload";
import { useRef, useState } from "react";
const Page = () => {
  const { data, refetch } = useViewerQuery();
  const [update] = useUpdateUserMutation();
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { upload } = useUpload();
  const [showUpdateUserProfile, setShowUpdateUserProfile] = useState(false);
  return (
    <div className={"bg-white"}>
      <div className={"flex items-center shadow p-2"}>
        <ToggleSidebarButton />
        <h1 className={"text-2xl font-bold p-4"}>Account</h1>
      </div>
      <div className={"p-4 flex flex-col gap-2"}>
        <div>
          <input
            className={"hidden"}
            disabled={uploading}
            onChange={async (e) => {
              if (!data?.viewer?.user?.id) {
                return;
              }
              if (!e.target.files || e.target.files.length === 0) {
                return;
              }
              const file = e.target.files[0];
              try {
                setUploading(true);
                const key = await upload(file);
                await update({
                  variables: {
                    updateUserId: data?.viewer?.user?.id,
                    input: {
                      avatar: key,
                    },
                  },
                });
                await refetch();
              } catch (error) {
                console.log(error);
                alert("Failed to upload file");
              } finally {
                setUploading(false);
                if (avatarFileRef.current) {
                  avatarFileRef.current.value = "";
                }
              }
            }}
            ref={avatarFileRef}
            type={"file"}
            accept={"image/*"}
          />
          <div className={"w-[100px] h-[100px] bg-gray-500 rounded-full"}>
            {data?.viewer?.user?.avatarUrl ? (
              <img
                src={data?.viewer.user?.avatarUrl}
                alt={data?.viewer.user?.name ?? ''}
                className={"w-full h-full object-cover rounded-full"}
              />
            ) : (
              <div
                className={
                  "w-full h-full flex items-center justify-center text-white text-3xl"
                }
              >
                {data?.viewer?.user?.name?.[0]?.toUpperCase() ?? ''}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (avatarFileRef.current) {
                avatarFileRef.current.click();
              }
            }}
            disabled={uploading}
            className={"text-primary text-sm"}
          >
            {uploading ? "Uploading..." : "Change Avatar"}
          </button>
        </div>
        <div>
          <p>
            <strong>Name:</strong> {data?.viewer?.user?.name}
          </p>
          <p>
            <strong>Email:</strong> {data?.viewer?.user?.email}
          </p>
          <div>
            <p>
              <strong>Password:</strong> ********{" "}
            </p>
            {!showUpdateUserProfile ? (
              <button
                onClick={() => setShowUpdateUserProfile(true)}
                className={"text-primary text-sm"}
              >
                Update my profile
              </button>
            ) : (
              <div className={"mt-4 p-4 max-w-lg shadow"}>
                {!data?.viewer || !data.viewer.user ? (
                  <p>Loading...</p>
                ) : (
                  <UpdateUserProfile
                    user={data?.viewer?.user}
                    onCompleted={() => {
                      setShowUpdateUserProfile(false);
                    }}
                    onCanceled={() => {
                      setShowUpdateUserProfile(false);
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
