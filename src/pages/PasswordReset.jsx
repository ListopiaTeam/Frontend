import React from "react";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function PasswordReset() {
  const { message, resetPassword } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    console.log(data.get("email"));
    console.log(message);

    resetPassword(data.get("email"));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-3xl font-bold text-center  text-gray-900">Password reset</h2>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                placeholder="you@example.com"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors shadow-sm"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
