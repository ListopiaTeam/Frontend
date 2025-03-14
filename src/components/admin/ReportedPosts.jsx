import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { fetchLists } from '../../utility/crudUtility';
import { NavLink } from 'react-router-dom';

const ReportedPosts = () => {
    const [selCateg, setSelCateg] = useState([]);
    const queryClient = useQueryClient()

    
      const { data: reportedLists, isLoading: loadingReportedLists, isError: errorReportedLists } = useInfiniteQuery({
        queryKey: ["reportedLists", selCateg],
        queryFn: ({ pageParam = null }) => fetchLists(10, selCateg, pageParam),
        getNextPageParam: (lastPage) => {
          if (!lastPage?.lastDoc) return undefined;
          return lastPage.lastDoc;
        },
    
        initialData: {
          pages: [],
          pageParams: [],
        },
    
        onError: (error) => {
          console.error("Error fetching lists:", error);
        },
    
      });  
    
      const filteredLists = reportedLists?.pages
      .flatMap((page) => page.docs) 
      .filter((doc) => doc.reports?.length > 0); 
    
      const handleDeleteList = async (listId) => {
        if (window.confirm("Are you sure you want to delete this list?")) {
          try {
            await deleteList(listId); 
            queryClient.invalidateQueries(["reportedLists"]); 
          } catch (error) {
            console.error("Error deleting list:", error);
          }
        }
      };
    
     
  return (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reported Posts</h2>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="px-6 py-3 text-sm font-medium text-gray-900">Reasons</th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-900">Reported By</th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-900">Reported List</th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLists.map((post) => (
                        <tr key={post.id} className="border-b">
                          <td className="px-6 py-4 text-sm text-gray-900"> {post.reports.map(report => report.content.join(', ')).join(', ')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{post.reports.length} people</td>
                          <td className="px-6 py-4 text-sm">
                            <NavLink to={"/details/" + post.id}
                              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
                            >
                              View
                            </NavLink>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleDeleteList(post.id)}
                              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
  )
}

export default ReportedPosts