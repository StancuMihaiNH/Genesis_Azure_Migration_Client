import DisplayTag from "@/components/DisplayTag/DisplayTag";
import Tooltip from "@/components/Tooltip/Tooltip";
import { Tag, useCategoriesAndTagsQuery, UserRole, useUpdateTagMutation } from "@/graphql/__generated__/schema";
import React, { useEffect, useState } from "react";
import { ITagsProps, Section } from "./Tag.types";

const Tags = (props: ITagsProps): JSX.Element => {
  const [updateTag] = useUpdateTagMutation();
  const [sections, setSections] = useState<Section[]>([]);
  const { data, refetch } = useCategoriesAndTagsQuery();
  const categories = data?.categories || [];
  const tags = data?.tags || [];
  useEffect(() => {
    //@ts-ignore
    const _sections: Section[] = categories.map((category) => {
      return {
        id: category?.id,
        category,
        tags: tags.filter((tag) => tag?.category?.id === category?.id)
      };
    });

    const generalTags = tags.filter((tag) => !tag?.category || categories.every((c) => c?.id !== tag?.category?.id));
    setSections([
      {
        id: "General",
        category: {
          id: "General",
          title: "General",
          createdAt: 0,
          user: {
            createdAt: 0,
            email: "",
            id: "",
            name: "",
            role: UserRole.Admin,
          },
          userId: ""
        },
        tags: generalTags as Tag[],
      },
      ..._sections
    ]);
  }, [data]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tag: Tag, categoryId: string) => {
    e.dataTransfer.setData("tagId", tag.id ?? "");
    e.dataTransfer.setData("fromCategoryId", categoryId);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>, categoryId: string): void => {
    e.preventDefault();
    const tagId: string = e.dataTransfer.getData("tagId");
    const fromCategoryId: string = e.dataTransfer.getData("fromCategoryId");
    const tag = tags.find((t): boolean => t?.id === tagId);
    if (!tag) {
      return;
    }

    if (fromCategoryId === categoryId) {
      return;
    }

    updateTag({
      variables: {
        input: {
          id: tagId,
          categoryId: categoryId === "General" ? null : categoryId,
          content: tag.content,
          displayName: tag.displayName,
        },
      },
      onCompleted: () => {
        refetch();
      },
    });

    const newSections = sections.map((section) => {
      if (section.id === categoryId) {
        return {
          ...section,
          tags: section.tags.filter((t) => t.id !== tag.id).concat(tag),
        };
      }

      if (section.id === fromCategoryId) {
        return {
          ...section,
          tags: section.tags.filter((t) => t.id !== tag.id),
        };
      }

      return section;
    });

    setSections(newSections);
  };

  return (
    <div className={"flex flex-col gap-4"}>
      {sections.map((section) => (
        <div
          key={section.id}
          onDragOver={handleDragOver}
          onDrop={(e) => {
            onDrop(e, section.id);
          }}
        >
          <div className={"flex"}>
            <Tooltip
              trigger={
                <h3 className={"text-lg font-semibold text-[#132e53] w-auto flex"}>
                  {section.category.title} ({section.tags.length})
                </h3>
              }
            >
              <p>{section.category.description || section.category.title}</p>
            </Tooltip>
          </div>
          <div className={"flex flex-wrap gap-2 mt-4"}>
            {section.tags.map((tag) => (
              <div
                key={tag.id}
                draggable={props.isAdmin}
                onDragStart={(e) => {
                  handleDragStart(e, tag, section.id);
                }}
              >
                <DisplayTag
                  onRemove={props.onRemoveTag}
                  onSelected={props.onSelectTag}
                  canDelete={props.isAdmin || props.viewer?.id === tag.user?.id}
                  selected={props.selectedTags?.some((t) => t.id === tag.id)}
                  tag={tag}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tags;