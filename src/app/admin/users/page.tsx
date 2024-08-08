"use client";
import AddUserForm from "@/components/AddUserForm/AddUserForm";
import ConfirmButton from "@/components/ConfirmButton/ConfirmButton";
import EditUserForm from "@/components/EditUserForm/EditUserForm";
import Modal from "@/components/Modal/Modal";
import ToggleSidebarButton from "@/components/ToggleSidebarButton/ToggleSidebarButton";
import { useDeleteUserMutation, User, UsersDocument, UsersQuery, useUsersQuery } from "@/graphql/__generated__/schema";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";

const Page = (): JSX.Element => {
  const [deleteUser] = useDeleteUserMutation();
  const { data, fetchMore, client } = useUsersQuery();
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser({
        variables: { deleteUserId: id },
        optimisticResponse: { deleteUser: true }
      });

      const readQuery = client.readQuery<UsersQuery>({ query: UsersDocument });
      if (readQuery) {
        client.writeQuery({
          query: UsersDocument,
          data: {
            users: {
              ...readQuery.users,
              items: readQuery.users?.items?.filter((u) => u?.id !== id)
            }
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowAddUser = (): void => setShowAddUser(true);
  const handleHideAddUser = (): void => setShowAddUser(false);
  const handleEditUser = (user: User): void => setEditUser(user);
  const handleHideEditUser = (): void => setEditUser(null);

  const handleAddUserCompleted = (user: User) => {
    const readQuery: UsersQuery | null = client.readQuery<UsersQuery>({ query: UsersDocument });
    if (readQuery && readQuery.users) {
      client.writeQuery({
        query: UsersDocument,
        data: {
          users: {
            ...readQuery.users,
            items: [...(readQuery.users.items ?? []), user]
          }
        }
      });
    }
    setShowAddUser(false);
  };

  const renderUsersTable = () => (
    <div className="relative overflow-x-auto z-2">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700">
          <tr className="border border-gray-200">
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Email</th>
            <th scope="col" className="px-6 py-3">Role</th>
            <th scope="col" className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.users?.items?.map((user): JSX.Element => (
            <tr key={user?.id} className="bg-white border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {user?.name}
              </th>
              <td className="px-6 py-4">{user?.email}</td>
              <td className="px-6 py-4">{user?.role}</td>
              <td className="px-6 py-4">
                <div className="flex gap-4 items-center rtl:space-x-reverse">
                  <button
                    onClick={(): void => handleEditUser(user as User)}
                    className="text-[#132e53] underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <ConfirmButton
                    className="text-red-500"
                    title="Delete"
                    confirmTitle="Sure?"
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
          className="text-[#132e53] underline cursor-pointer"
          onClick={() => {
            fetchMore({
              variables: { nextToken: data.users?.nextToken },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                return {
                  users: {
                    ...fetchMoreResult.users,
                    items: [
                      ...(prev.users?.items || []),
                      ...(fetchMoreResult.users?.items || [])
                    ]
                  }
                };
              }
            });
          }}
        >
          Load More
        </button>
      )}
    </div>
  );

  const renderModals = (): JSX.Element => (
    <>
      {editUser && (
        <Modal
          title="Edit User"
          open={true}
          onClose={handleHideEditUser}
        >
          <EditUserForm
            user={editUser}
            onCompleted={handleHideEditUser}
          />
        </Modal>
      )}
      <Modal
        title="Add User"
        open={showAddUser}
        onClose={handleHideAddUser}
      >
        <AddUserForm
          onCompleted={handleAddUserCompleted}
        />
      </Modal>
    </>
  );

  return (
    <>
      <div className="flex flex-col flex-1 gap-2">
        <div className="bg-white">
          <div className="flex p-4 gap-2 items-center shadow">
            <ToggleSidebarButton />
            <h1 className="text-2xl font-bold">Users</h1>
            <button
              onClick={handleShowAddUser}
              className="text-[#132e53] px-4 py-2 rounded flex items-center"
              type="button"
            >
              <RiAddLine />
              Add User
            </button>
          </div>
          <div className="p-4">
            {renderUsersTable()}
          </div>
        </div>
      </div>
      {renderModals()}
    </>
  );
};

export default Page;