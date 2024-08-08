import { useCreateUserMutation } from "@/graphql/__generated__/schema";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { FormValues, IAddUserFormProps } from "./AddUserForm.types";



const AddUserForm = (props: IAddUserFormProps): JSX.Element => {
  const [addUser, { loading, error }] = useCreateUserMutation();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await addUser({
        variables: {
          name: data.name.trim(),
          email: data.email
        }
      });

      if (res.data?.createUser) {
        props.onCompleted?.(res.data.createUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="name" className="text-gray-700">
          Name
        </label>
        <input
          className={classNames("p-2 border border-gray-200 rounded", {
            "border-red-500": errors.name
          })}
          type="text"
          id="name"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-sm text-red-500">
            {errors.name.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="email" className="text-gray-700">
          Email
        </label>
        <input
          className={classNames("p-2 border border-gray-200 rounded", {
            "border-red-500": errors.email,
          })}
          type="email"
          id="email"
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && (
          <span className="text-sm text-red-500">
            {errors.email.message}
          </span>
        )}
      </div>
      <button
        disabled={loading}
        type="submit"
        className="bg-[#132e53] text-white px-4 py-2 rounded"
      >
        {loading ? "Saving" : "Save"}
      </button>
      {error && <div className="text-red-500 mt-2">{error.message}</div>}
    </form>
  );
};

export default AddUserForm;