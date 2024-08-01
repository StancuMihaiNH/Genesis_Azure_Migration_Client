import { User, useUpdateUserMutation } from "@/graphql/__generated__/schema";
import classNames from "classnames";
import React from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
};

const UpdateUserProfile: React.FC<{ onCanceled?: () => void; onCompleted?: () => void; user: User }> = ({ user, onCanceled, onCompleted }) => {
  const [update, { loading, error }] = useUpdateUserMutation();
  const { register, watch, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: user.name ?? "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await update({
        variables: {
          updateUserId: user.id ?? "",
          input: {
            name: data.name
          },
        },
      });
      onCompleted?.();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form>
      {error && (
        <div className={"bg-red-500 text-white p-2 rounded-md"}>
          {error.message}
        </div>
      )}
      <div
        className={classNames("flex flex-col gap-2 mb-4", {
          "border-red-500": errors.name,
        })}
      >
        <label htmlFor="name" className={"text-gray-700"}>
          Name
        </label>
        <input
          className={"p-2 border border-gray-200 rounded"}
          type="text"
          id="name"
          {...register("name", { required: true })}
        />
        {errors.name && (
          <span className={"text-sm text-red-500"}>
            {errors.name.message || "This field is required"}
          </span>
        )}
      </div>
      <div className={"flex gap-4 justify-end"}>
        <button
          type={"button"}
          onClick={onCanceled}
          className={"bg-gray-500 text-white p-2 px-4 rounded-md"}
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type={"submit"}
          onClick={handleSubmit(onSubmit)}
          className={"bg-[#132e53] text-white p-2 px-4 rounded-md"}
        >
          {loading ? "Saving" : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

export default UpdateUserProfile;