import { Category, CategoryFragmentFragmentDoc, useEditCategoryMutation, useUsersQuery } from "@/graphql/__generated__/schema";
import classNames from "classnames";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormValues, IEditCategoryFormProps } from "./EditCategoryForm.types";

const EditCategoryForm = (props: IEditCategoryFormProps): JSX.Element => {
  const [editCategory, { loading, error, client }] = useEditCategoryMutation();
  const { data: usersData, loading: usersLoading } = useUsersQuery();
  const { reset, handleSubmit, register, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: props.category.title ?? "",
      description: props.category.description || "",
      userId: props.category.userId ?? ""
    },
  });

  useEffect((): void => {
    reset({
      title: props.category.title ?? "",
      description: props.category.description || "",
      userId: props.category.userId ?? ""
    });
  }, [props.category]);

  const onSubmit = async ({ title, description, userId }: FormValues) => {
    try {
      const { data } = await editCategory({
        variables: {
          editCategoryId: props.category.id ?? "",
          title: title.trim(),
          description: description.trim(),
          userId: userId || undefined
        }
      });

      if (data?.editCategory) {
        const readFragment: Category | null = client.readFragment<Category>({
          id: `Category:${props.category.id}`,
          fragment: CategoryFragmentFragmentDoc,
          fragmentName: "CategoryFragment"
        });

        if (readFragment) {
          client.writeFragment({
            id: `Category:${props.category.id}`,
            fragment: CategoryFragmentFragmentDoc,
            fragmentName: "CategoryFragment",
            data: {
              ...readFragment,
              title: title.trim(),
              description: description.trim(),
            },
          });
        }
      }
      props.onDone?.();
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
            "border-red-500": errors.title,
          })}
          type="text"
          id="name"
          {...register("title", { required: true })}
        />
        {errors.title && (
          <span className={"text-sm text-red-500"}>
            {errors.title.message || "This field is required"}
          </span>
        )}
      </div>
      <div className={"flex flex-col gap-2 mb-4"}>
        <label htmlFor="email" className={"text-gray-700"}>
          Description
        </label>
        <textarea
          className={classNames("p-2 border border-gray-200 rounded", {
            "border-red-500": errors.description,
          })}
          id="description"
          {...register("description")}
        />
      </div>
      {props.canChangeOwner && (
        <div className={"flex flex-col gap-2 mb-4"}>
          <label htmlFor="owner" className={"text-gray-700"}>
            Owner
          </label>
          {usersLoading
            ? <p>Loading...</p>
            : <select
              className={classNames("p-2 border border-gray-200 rounded", {
                "border-red-500": errors.userId,
              })}
              id="owner"
              {...register("userId", { required: true })}>
              {usersData?.users?.items?.map((user) => (
                <option key={user?.id} value={user?.id ?? ""}>
                  {user?.name}
                </option>
              ))}
            </select>}
          {errors.userId && (
            <span className={"text-sm text-red-500"}>
              {errors.userId.message || "This field is required"}
            </span>
          )}
        </div>
      )}
      <button disabled={loading}
        type="submit"
        className={"bg-[#132e53] text-white px-4 py-2 rounded"}>
        {loading ? "Saving" : "Save"}
      </button>
    </form>
  );
};

export default EditCategoryForm;