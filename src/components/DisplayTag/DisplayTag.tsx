import Modal from "@/components/Modal/Modal";
import Tooltip from "@/components/Tooltip/Tooltip";
import { Tag, TagsDocument, useDeleteTagMutation } from "@/graphql/__generated__/schema";
import classNames from "classnames";
import { useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { IDisplayProps } from "./Display.types";

const DisplayTag = (props: IDisplayProps): JSX.Element => {
  const [deleteTag, { loading, client }] = useDeleteTagMutation();
  const [confirmDelete, setConfirmDelete] = useState<Tag | undefined>();
  return (
    <>
      <Tooltip
        delayDuration={0}
        trigger={
          <div
            onClick={(): void => {
              if (props.selected && props.onRemove) {
                props.onRemove(props.tag);
                return;
              }

              if (props.onSelected) {
                props.onSelected(props.tag);
              }
            }}
            key={props.tag.id}
            className={classNames(
              "cursor-pointer px-4 py-2 text-[#525252] text-sm hover:opacity-90 rounded-full flex items-center gap-2",
              {
                "bg-[#dee22a]": props.selected,
                "bg-gray-400": !props.selected
              }
            )}
          >
            <p>{props.tag.displayName}</p>
            {props.canDelete && (
              <button
                disabled={loading}
                onClick={async (e) => {
                  e.stopPropagation();
                  setConfirmDelete(props.tag);
                }}
              >
                <RiCloseLine size={20} />
              </button>
            )}
          </div>
        }
      >
        {props.tag.content || props.tag.displayName}
      </Tooltip>
      {confirmDelete &&
        <Modal
          title={"Delete Tag"}
          open={true}
          onClose={() => {
            setConfirmDelete(undefined);
          }}
        >
          <div className={"flex flex-col gap-4"}>
            <p>
              Are you sure you want to delete{" "}
              <strong>{confirmDelete.displayName}</strong>?
            </p>
            <div className={"flex gap-4 justify-between"}>
              <button
                onClick={() => {
                  setConfirmDelete(undefined);
                }}
              >
                Cancel
              </button>
              <button
                className={"bg-red-500 text-white rounded px-4 py-2"}
                onClick={async () => {
                  try {
                    deleteTag({
                      variables: {
                        deleteTagId: confirmDelete.id ?? ""
                      },
                      optimisticResponse: {
                        deleteTag: true,
                      }
                    });
                    if (props.onRemove) {
                      props.onRemove(confirmDelete);
                    }

                    const { tags } = client.readQuery({ query: TagsDocument });
                    if (!tags) {
                      return;
                    }

                    client.writeQuery({
                      query: TagsDocument,
                      data: {
                        tags: tags.filter((t: Tag): boolean => t.id !== confirmDelete.id)
                      }
                    });
                    setConfirmDelete(undefined);
                  } catch (err) {
                    console.log(err);
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      }
    </>
  );
};

export default DisplayTag;