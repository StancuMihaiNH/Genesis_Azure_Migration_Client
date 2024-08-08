import { UserRole, useUpdateUserMutation } from "@/graphql/__generated__/schema";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { FormValues, IEditUserFormProps } from "./EditUserForm.types";

const EditUserForm = (props: IEditUserFormProps): JSX.Element => {
  const [update, { loading, error }] = useUpdateUserMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: props.user.name ?? "",
      role: props.user.role ?? undefined,
    }
  });

  const onSubmit = async (data: FormValues): Promise<void> => {
    try {
      await update({
        variables: {
          updateUserId: props.user.id ?? "",
          input: {
            name: data.name.trim(),
            role: data.role,
          },
        },
      });
      props.onCompleted?.();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={"flex flex-col gap-2 mb-4"}>
        <label htmlFor="name" className={"text-gray-700"}>
          Name
        </label>
        <input
          className={classNames("p-2 border border-gray-200 rounded", {
            "border-red-500": errors.name,
          })}
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
      <div className={"flex flex-col gap-2 mb-4"}>
        <label htmlFor="role" className={"text-gray-700"}>
          Role
        </label>
        <select
          className={"p-2 border border-gray-200 rounded"}
          id="role"
          {...register("role", { required: true })}
        >
          <option value={UserRole.Admin}>Admin</option>
          <option value={UserRole.User}>User</option>
        </select>
      </div>
      {error && (
        <div className={"text-red-500 text-sm mb-4"}>{error.message}</div>
      )}
      <button
        disabled={loading}
        type="submit"
        className={"bg-[#132e53] text-white px-4 py-2 rounded"}
      >
        {loading ? "Saving" : "Save"}
      </button>
    </form>
  );
};

export default EditUserForm;
