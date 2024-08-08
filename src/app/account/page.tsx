"use client";
import ToggleSidebarButton from "@/components/ToggleSidebarButton/ToggleSidebarButton";
import UpdateUserProfile from "@/components/UpdateUserProfile/UpdateUserProfile";
import { useUpdateUserMutation, useViewerQuery } from "@/graphql/__generated__/schema";
import useUpload from "@/hooks/useUpload";
import { RefObject, useRef, useState } from "react";

const AVATAR_PLACEHOLDER_CLASS = "w-full h-full flex items-center justify-center text-white text-3xl";
const BUTTON_TEXT_PRIMARY_CLASS = "text-primary text-sm";
const HIDDEN_INPUT_CLASS = "hidden";
const AVATAR_CONTAINER_CLASS = "w-[100px] h-[100px] bg-gray-500 rounded-full";
const CONTAINER_CLASS = "bg-white";
const HEADER_CLASS = "flex items-center shadow p-2";
const TITLE_CLASS = "text-2xl font-bold p-4";
const CONTENT_CLASS = "p-4 flex flex-col gap-2";
const PROFILE_UPDATE_CLASS = "mt-4 p-4 max-w-lg shadow";

const Page = (): JSX.Element => {
  const { data, refetch } = useViewerQuery();
  const [update] = useUpdateUserMutation();
  const avatarFileRef: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { upload } = useUpload();
  const [showUpdateUserProfile, setShowUpdateUserProfile] = useState<boolean>(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data?.viewer?.user?.id) {
      return;
    }

    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file: File = e.target.files[0];
    try {
      setUploading(true);
      const key = await upload(file);
      await update({
        variables: {
          updateUserId: data.viewer.user.id,
          input: { avatar: key }
        }
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
  };

  const handleAvatarClick = () => {
    if (avatarFileRef.current) {
      avatarFileRef.current.click();
    }
  };

  const toggleUpdateUserProfile = () => {
    setShowUpdateUserProfile((prev) => !prev);
  };

  return (
    <div className={CONTAINER_CLASS}>
      <div className={HEADER_CLASS}>
        <ToggleSidebarButton />
        <h1 className={TITLE_CLASS}>Account</h1>
      </div>
      <div className={CONTENT_CLASS}>
        <div>
          <input
            className={HIDDEN_INPUT_CLASS}
            disabled={uploading}
            onChange={handleFileChange}
            ref={avatarFileRef}
            type="file"
            accept="image/*"
          />
          <div className={AVATAR_CONTAINER_CLASS}>
            {data?.viewer?.user?.avatarUrl ? (
              <img
                src={data.viewer.user.avatarUrl}
                alt={data.viewer.user.name ?? ""}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className={AVATAR_PLACEHOLDER_CLASS}>
                {data?.viewer?.user?.name?.[0]?.toUpperCase() ?? ""}
              </div>
            )}
          </div>
          <button onClick={handleAvatarClick} disabled={uploading} className={BUTTON_TEXT_PRIMARY_CLASS}>
            {uploading ? "Uploading..." : "Change Avatar"}
          </button>
        </div>
        <div>
          <p><strong>Name:</strong> {data?.viewer?.user?.name}</p>
          <p><strong>Email:</strong> {data?.viewer?.user?.email}</p>
          <div>
            {!showUpdateUserProfile ? (
              <button onClick={toggleUpdateUserProfile} className={BUTTON_TEXT_PRIMARY_CLASS}>
                Update my profile
              </button>
            ) : (
              <div className={PROFILE_UPDATE_CLASS}>
                {!data?.viewer || !data.viewer.user ? (
                  <p>Loading...</p>
                ) : (
                  <UpdateUserProfile
                    user={data.viewer.user}
                    onCompleted={toggleUpdateUserProfile}
                    onCanceled={toggleUpdateUserProfile}
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