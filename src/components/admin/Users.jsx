import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { deleteUser } from "../../utility/rawgAPI";
import { fetchUsers } from "../../utility/crudUtility";

const Users = () => {
  const queryClient = useQueryClient();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); 

  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { docs } = await fetchUsers();
      return docs;
    },
    onError: (error) => console.error("Error fetching users:", error),
  });

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;
    try {
      await deleteUser(selectedUserId);
      queryClient.invalidateQueries(["all-users"]);
      setShowPopup(false); 
      setSelectedUserId(null); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Users</h2>
        {usersLoading ? (
          <div className="text-center py-4">Loading users...</div>
        ) : usersError ? (
          <div className="text-center py-4 text-red-500">Error loading users</div>
        ) : (
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left border-b">
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">User Name</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Email</th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.displayName || user.email.split("@")[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          setSelectedUserId(user.id);
                          setShowPopup(true);
                        }}
                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
                      >
                        Delete user
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">Delete Account</h3>
              <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="px-4 py-2 sm:px-5 sm:py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
