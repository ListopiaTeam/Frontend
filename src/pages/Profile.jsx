import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utility/crudUtility";

export default function Profile() {
	const [activeTab, setActiveTab] = useState("profilesettings");
	const { user } = useContext(UserContext);

	const navigate = useNavigate();

	useEffect(() => {
		const path = location.pathname.split("/").pop();
		setActiveTab(path);
	}, [location]);

	useEffect(() => {
		if (user === undefined) return;
	}, [user]);

	return (
		<div className="min-h-screen py-16 mt-16">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
					<h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
						Profile
					</h1>

					{/* Tabs */}
					<div className="flex flex-wrap border-b-2 border-gray-300 mb-6">
						<NavLink
							to={"/profile/profilesettings"}
							className={`w-full sm:w-auto px-4 py-2 text-lg font-semibold ${activeTab === "profilesettings" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"}`}
							onClick={() => setActiveTab("users")}
						>
							Profile Settings
						</NavLink>
						<NavLink
							to={"/profile/likedlists"}
							className={`w-full sm:w-auto px-4 py-2 text-lg font-semibold ${activeTab === "likedlists" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"}`}
							onClick={() => setActiveTab("likedlists")}
						>
							Liked Lists
						</NavLink>
						<NavLink
							to={"/profile/mylists"}
							className={`w-full sm:w-auto px-4 py-2 text-lg font-semibold ${activeTab === "mylists" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"}`}
							onClick={() => setActiveTab("createdlists")}
						>
							My Lists
						</NavLink>
					</div>
					<Outlet />
				</div>
			</div>
		</div>
	);
}
