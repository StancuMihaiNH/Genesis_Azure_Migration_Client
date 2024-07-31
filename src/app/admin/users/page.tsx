"use client";
import AddUserForm from "@/components/AddUserForm";
import ConfirmButton from "@/components/ConfirmButton";
import EditUserForm from "@/components/EditUserForm";
import Modal from "@/components/Modal";
import ToggleSidebarButton from "@/components/ToggleSidebarButton";
import {
  useDeleteUserMutation,
  User,
  UsersDocument,
  UsersQuery,
  useUsersQuery,
} from "@/graphql/__generated__/schema";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
const Page = () => {
  const [deleteUser] = useDeleteUserMutation();
  const { data, fetchMore, client } = useUsersQuery();
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const handleDeleteUser = (id: string) => {
    try {
      deleteUser({
        variables: { deleteUserId: id },
        optimisticResponse: {
          deleteUser: true,
        },
      });
      const readQuery = client.readQuery<UsersQuery>({
        query: UsersDocument,
      });
      if (readQuery) {
        client.writeQuery({
          query: UsersDocument,
          data: {
            users: {
              ...readQuery.users,
              items: readQuery.users?.items?.filter((u) => u?.id !== id),
            },
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className={"flex flex-col flex-1 gap-2"}>
        <div className={"bg-white"}>
          <div className={"flex p-4 gap-2 items-center shadow"}>
            <ToggleSidebarButton />
            <h1 className={"text-2xl font-bold"}>Users</h1>
            <button
              onClick={() => setShowAddUser(true)}
              className={"text-[#132e53] px-4 py-2 rounded flex items-center"}
              type={"button"}
            >
              <RiAddLine />
              Add User
            </button>
          </div>
          <div className={"p-4"}>
            <div className={"relative overflow-x-auto z-2"}>
              <table
                className={
                  "w-full text-sm text-left rtl:text-right text-gray-500"
                }
              >
                <thead
                  className={
                    "text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700"
                  }
                >
                  <tr className={"border border-gray-200"}>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users?.items?.map((user) => (
                    <tr key={user?.id} className={"bg-white border-b"}>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {user?.name}
                      </th>
                      <td className={"px-6 py-4"}>{user?.email}</td>
                      <td className={"px-6 py-4"}>{user?.role}</td>
                      <td className={"px-6 py-4"}>
                        <div
                          className={
                            "flex gap-4 items-center rtl:space-x-reverse"
                          }
                        >
                          <button
                            onClick={() => setEditUser(user)}
                            className={
                              "text-[#132e53] underline cursor-pointer"
                            }
                          >
                            Edit
                          </button>
                          <ConfirmButton
                            className={"text-red-500"}
                            title={"Delete"}
                            confirmTitle={"Sure?"}
                            onConfirm={() => handleDeleteUser(user?.id ?? "")}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data?.users?.nextToken && (
                <button
                  className={"text-[#132e53] underline cursor-pointer"}
                  onClick={() => {
                    fetchMore({
                      variables: {
                        nextToken: data.users?.nextToken,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (!fetchMoreResult) return prev;
                        return {
                          users: {
                            ...fetchMoreResult.users,
                            items: [
                              ...(prev.users?.items || []),
                              ...(fetchMoreResult.users?.items || []),
                            ],
                          },
                        };
                      },
                    });
                  }}
                >
                  Load More
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {editUser && (
        <Modal
          title={"Edit User"}
          open={true}
          onClose={() => setEditUser(null)}
        >
          <EditUserForm
            user={editUser}
            onCompleted={() => {
              setEditUser(null);
            }}
          />
        </Modal>
      )}
      <Modal
        title={"Add User"}
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
      >
        <AddUserForm
          onCompleted={(user) => {
            const readQuery = client.readQuery({
              query: UsersDocument,
            });
            if (readQuery) {
              client.writeQuery({
                query: UsersDocument,
                data: {
                  users: {
                    ...readQuery.users,
                    items: [...readQuery.users.items, user],
                  },
                },
              });
            }
            setShowAddUser(false);
          }}
        />
      </Modal>
    </>
  );
};

export default Page;
