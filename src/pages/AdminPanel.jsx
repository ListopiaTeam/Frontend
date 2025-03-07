import React, { useState } from "react";
import { motion } from "framer-motion"; // Import framer-motion for animations

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users");

  // Dummy data for users 
  const dummyUsers = [
    { id: 1, username: "JohnDoe", email: "johndoe@example.com" },
    { id: 2, username: "JaneSmith", email: "janesmith@example.com" },
    { id: 3, username: "BobJohnson", email: "bobjohnson@example.com" },
  ];

  // Dummy data for reported posts
  const dummyReportedPosts = [
    { id: 1, title: "Offensive Content in Post", reportedBy: "JohnDoe" },
    { id: 2, title: "Spam in Comment Section", reportedBy: "JaneSmith" },
    { id: 3, title: "Hate Speech in Post", reportedBy: "BobJohnson" },
  ];

  // Dummy data for event creation
  const dummyEvents = [
    { id: 1, eventName: "Summer Bash", eventDate: "2025-06-15" },
    { id: 2, eventName: "Winter Gala", eventDate: "2025-12-20" },
  ];

  const handlePostAction = (postId, action) => {
    console.log(`Post ID: ${postId}, Action: ${action}`);
  };

  const handleEventCreation = (eventName, eventDate) => {
    console.log(`Event Created: ${eventName}, Date: ${eventDate}`);
  };

  return (
    <div className="min-h-screen py-16 mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Admin Dashboard
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap border-b-2 border-gray-300 mb-6">
            <button
              className={`w-full sm:w-auto px-6 py-2 text-lg font-semibold ${activeTab === "users" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button
              className={`w-full sm:w-auto px-6 py-2 text-lg font-semibold ${activeTab === "reportedPosts" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("reportedPosts")}
            >
              Reported Posts
            </button>
            <button
              className={`w-full sm:w-auto px-6 py-2 text-lg font-semibold ${activeTab === "createEvent" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"}`}
              onClick={() => setActiveTab("createEvent")}
            >
              Create Event
            </button>
          </div>

          <motion.div
            key={activeTab} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Users Tab */}
            {activeTab === "users" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Users</h2>
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
                      {dummyUsers.map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="px-6 py-4 text-sm text-gray-900">{user.username}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => console.log(`Ban User: ${user.id}`)}
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
              </div>
            )}

            {/* Reported Posts Tab */}
            {activeTab === "reportedPosts" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reported Posts</h2>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="px-6 py-3 text-sm font-medium text-gray-900">Post Title</th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-900">Reported By</th>
                        <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyReportedPosts.map((post) => (
                        <tr key={post.id} className="border-b">
                          <td className="px-6 py-4 text-sm text-gray-900">{post.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{post.reportedBy}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handlePostAction(post.id, "delete")}
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
            )}

            {/* Create Event Tab */}
            {activeTab === "createEvent" && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Event</h2>
                <div className="bg-white shadow-md p-6 rounded-lg">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const eventName = e.target.eventName.value;
                      const eventDate = e.target.eventDate.value;
                      handleEventCreation(eventName, eventDate);
                    }}
                  >
                    <div className="mb-4">
                      <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
                        Event Name
                      </label>
                      <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                        Event Date
                      </label>
                      <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-6 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-all"
                    >
                      Create Event
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
