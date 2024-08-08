import { CategoriesDocument, CategoriesQuery, Category, useAddCategoryMutation } from "@/graphql/__generated__/schema";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { IAddCategoryFormProps, IFormValues } from "./AddCateogoryForm.types";


const AddCategoryForm = (props: IAddCategoryFormProps): JSX.Element => {
  const [addCategory, { loading, error, client }] = useAddCategoryMutation();
  const { handleSubmit, register, formState: { errors } } = useForm<IFormValues>({
    defaultValues: {
      title: "",
      description: ""
    },
  });

  const onSubmit = async ({ title, description }: IFormValues) => {
    try {
      const { data } = await addCategory({
        variables: {
          title: title.trim(),
          description: description.trim(),
        },
      });

      if (data?.addCategory) {
        const readQuery: CategoriesQuery | null = client.readQuery<CategoriesQuery>({
          query: CategoriesDocument,
        });

        if (readQuery) {
          client.writeQuery<CategoriesQuery>({
            query: CategoriesDocument,
            data: {
              categories: [...(readQuery.categories ?? []), data.addCategory] as (Category | null)[],
            },
          });
        }
      }

      props.onDone?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="title" className="text-gray-700">
          Title
        </label>
        <input
          className={classNames("p-2 border border-gray-200 rounded", {
            "border-red-500": errors.title,
          })}
          type="text"
          id="title"
          {...register("title", { required: "This field is required" })}
        />
        {errors.title && (
          <span className="text-sm text-red-500">
            {errors.title?.message || "This field is required"}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <label htmlFor="description" className="text-gray-700">
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
      <button
        disabled={loading}
        type="submit"
        className="bg-[#132e53] text-white px-4 py-2 rounded"
      >
        {loading ? "Saving" : "Save"}
      </button>
    </form>
  );
};

export default AddCategoryForm;