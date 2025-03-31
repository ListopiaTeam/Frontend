import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utility/crudUtility";
export default function AdminPanel() {
	const [activeTab, setActiveTab] = useState("users");
	const { user } = useContext(UserContext);

	const navigate = useNavigate();

	useEffect(() => {
		const path = location.pathname.split("/").pop();
		setActiveTab(path);
	}, [location]);

	const fetchAdminStatus = async () => {
		if (!user) {
			navigate("/");
			return;
		}

		const userData = await getUser(user.uid);
		if (!userData || !userData.isAdmin) {
			navigate("/");
		}
	};

	useEffect(() => {
		if (user === undefined) return;
		fetchAdminStatus();
	}, [user]);

	return (
		<div className="min-h-screen py-16 mt-16">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
					<h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
						Admin Dashboard
					</h1>

					{/* Tabs */}
					<div className="flex flex-wrap border-b-2 border-gray-300 mb-6">
						<NavLink
							to={"/adminpanel/users"}
							className={`w-full sm:w-auto px-6 py-2 text-lg font-semibold ${activeTab === "users" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"}`}
							onClick={() => setActiveTab("users")}
						>
							Users
						</NavLink>
						<NavLink
							to={"/adminpanel/reportedposts"}
							className={`w-full sm:w-auto px-6 py-2 text-lg font-semibold ${activeTab === "reportedposts" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"}`}
							onClick={() => setActiveTab("reportedPosts")}
						>
							Reported Posts
						</NavLink>
						<NavLink
							to={"/adminpanel/createevent"}
							className={`w-full sm:w-auto px-6 py-2 text-lg font-semibold ${activeTab === "createevent" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"}`}
							onClick={() => setActiveTab("createEvent")}
						>
							Create Event
						</NavLink>
					</div>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
