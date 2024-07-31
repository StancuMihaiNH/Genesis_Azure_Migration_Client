"use client";
import AddTagForm from "@/components/AddTagForm";
import EditTagForm from "@/components/EditTagForm";
import Modal from "@/components/Modal";
import TabNav from "@/components/TabNav";
import Tags from "@/components/Tags";
import ToggleSidebarButton from "@/components/ToggleSidebarButton";
import {
  Category,
  Tag,
  TagsDocument,
  useCategoriesQuery,
  UserRole,
  useTagsQuery,
  useViewerQuery,
} from "@/graphql/__generated__/schema";
import { Constants } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RiAddLine, RiCloseLine } from "react-icons/ri";
const Page = () => {
  const { data: viewer } = useViewerQuery();
  const { data, client } = useTagsQuery();
  const { data: categoriesData } = useCategoriesQuery();
  const [showAddTag, setShowAddTag] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const tags = data?.tags || [];
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem(
      Constants.NEXT_PUBLIC_ACCESS_TOKEN_KEY || "",
    );
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <div className={"flex flex-col flex-1 p-4 gap-2"}>
        <div className={"bg-white"}>
          <ToggleSidebarButton />
          <TabNav
            links={[
              { title: "Tags", href: "/admin/tags" },
              { title: "Categories", href: "/admin/categories" },
            ]}
          />

          <div className={"p-4"}>
            <div className={"flex gap-2 items-center"}>
              <h1 className={"text-2xl font-bold"}>Tags</h1>
              <button
                onClick={() => setShowAddTag(true)}
                className={"text-[#132e53] px-4 py-2 rounded flex items-center"}
                type={"button"}
              >
                <RiAddLine />
                Add Tag
              </button>
            </div>
            <div className={"flex-col mt-4 mb-4 flex gap-4"}>
              <Tags
                viewer={viewer?.viewer?.user}
                onSelectTag={(tag) => {
                  if (
                    viewer?.viewer?.user?.role === UserRole.Admin ||
                    viewer?.viewer?.user?.id === tag.userId
                  ) {
                    setEditTag(tag);
                  }
                }}
                isAdmin={viewer?.viewer?.user?.role === UserRole.Admin}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal
        title={"Add new Tag"}
        open={showAddTag}
        onClose={() => setShowAddTag(false)}
      >
        <AddTagForm
          categories={categoriesData?.categories as Category[] || []}
          onAdded={(tag) => {
            client.writeQuery({
              query: TagsDocument,
              data: {
                tags: [...tags, tag],
              },
            });
            setSelectedTags([...selectedTags, tag]);
            setShowAddTag(false);
          }}
        />
      </Modal>
      {editTag &&
        createPortal(
          <div
            id={"left-drawer"}
            className={
              "fixed top-0 right-0 w-full lg:w-1/3 h-full bg-white transition duration-100 shadow animate-slideDownAndFade"
            }
          >
            <div className={"p-4 h-screen flex flex-col gap-2"}>
              <div className={"border-b border-[#132e53] pb-2"}>
                <div className={"flex justify-between"}>
                  <h2 className={"text-[#132e53] text-lg font-bold"}>
                    {editTag.displayName}
                  </h2>
                  <button onClick={() => setEditTag(null)}>
                    <RiCloseLine size={30} />
                  </button>
                </div>
              </div>
              <div className={"overflow-y-auto flex-1"}>
                <EditTagForm
                  canChangeOwner={viewer?.viewer?.user?.role === UserRole.Admin}
                  oneDone={() => setEditTag(null)}
                  tag={editTag}
                  categories={categoriesData?.categories as Category[] || []}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default Page;