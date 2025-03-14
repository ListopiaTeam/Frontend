import { useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from 'firebase/auth';
import React from 'react'
import { fetchUsers } from '../../utility/crudUtility';

const Users = () => {
    const queryClient = useQueryClient()

      const {
        data: usersData,
        isLoading: usersLoading,
        isError: usersError
      } = useQuery({
        queryKey: ['all-users'],
        queryFn: async () => {
          const { docs } = await fetchUsers(); 
          return docs;
        },
        onError: (error) => console.error("Error fetching users:", error)
      });

       const handleDeleteUser = async (userId) => {
          if(window.confirm("Are you sure to delete this user?")){
            try {
              await deleteUser(userId)
              queryClient.invalidateQueries(["all-users"])
            } catch (error) {
              console.log(error);
              
            }
          }
        }
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
                      {user.displayName || user.email.split('@')[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
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
      </>


//     {/* Create Event Tab */}
//     {activeTab === "createEvent" && (
//       <div>
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Event</h2>
//         <div className="bg-white shadow-md p-6 rounded-lg">
//           <form onSubmit={handleSubmit(handleEventCreation)}>
//             <div className="mb-4">
//               <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
//                 Event Name
//               </label>
//               <input
//                 type="text"
//                 id="eventName"
//                 {...register("eventName", { required: "Event name is required" })}
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-lg mb-4"
//               />
//               {errors.eventName && <p className="text-red-500 text-sm">{errors.eventName.message}</p>}
//             </div>

//             <div className="mb-4">
//               <label htmlFor="eventDesc" className="block text-sm font-medium text-gray-700">
//                 Event Description
//               </label>
//               <input
//                 type="text"
//                 id="eventDesc"
//                 {...register("eventDesc", { required: "Event description is required" })}
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
//               />
//               {errors.eventDesc && <p className="text-red-500 text-sm">{errors.eventDesc.message}</p>}
//             </div>

//             <div className="mb-4">
//               <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
//                 Event Date
//               </label>
//               <input
//                 type="date"
//                 id="eventDate"
//                 {...register("eventDate", { required: "Event date is required" })}
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
//               />
//               {errors.eventDate && <p className="text-red-500 text-sm">{errors.eventDate.message}</p>}
//             </div>

//             <div className="mb-4">
//               <label htmlFor="file" className="block text-sm font-medium text-gray-700">
//                 Event Image
//               </label>
//               <input
//                 type="file"
//                 {...register("file", { required: "Event image is required" })}
//                 className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
//               />
//               {errors.file && <p className="text-red-500 text-sm">{errors.file.message}</p>}
//             </div>

//             <button
//               type="submit"
//               className="w-full px-6 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-all"
//             >
//               Create Event
//             </button>
//           </form>
//         </div>
//       </div>
//     )}
//   </motion.div>
  )
}

export default Users