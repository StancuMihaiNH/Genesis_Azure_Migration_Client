import { useCreateUserMutation, User } from "@/graphql/__generated__/schema";
import classNames from "classnames";
import React from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
};

const AddUserForm: React.FC<{
  onCompleted?: (user: User) => void;
}> = ({ onCompleted }) => {
  const [addUser, { loading, error }] = useCreateUserMutation();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await addUser({
        variables: {
          name: data.name.trim(),
          email: data.email
        },
      });
      if (res.data?.createUser) {
        onCompleted?.(res.data?.createUser);
      }
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
        <label htmlFor="email" className={"text-gray-700"}>
          Email
        </label>
        <input
          className={classNames("p-2 border border-gray-200 rounded", {
            "border-red-500": errors.email,
          })}
          type="email"
          id="email"
          {...register("email", {
            required: true,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors.email && (
          <span className={"text-sm text-red-500"}>
            {errors.email.message || "This field is required"}
          </span>
        )}
      </div>
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

export default AddUserForm;
