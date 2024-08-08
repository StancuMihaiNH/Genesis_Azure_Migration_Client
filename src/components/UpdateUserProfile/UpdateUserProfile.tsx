import { useUpdateUserMutation } from "@/graphql/__generated__/schema";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { FormValues, IUpdateUserProfileProps } from "./UpdateUserProfile.types";



const UpdateUserProfile = (props: IUpdateUserProfileProps): JSX.Element => {
  const [update, { loading, error }] = useUpdateUserMutation();
  const { register, watch, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: props.user.name ?? ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await update({
        variables: {
          updateUserId: props.user.id ?? "",
          input: {
            name: data.name
          }
        }
      });
      props.onCompleted?.();
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
          onClick={props.onCanceled}
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