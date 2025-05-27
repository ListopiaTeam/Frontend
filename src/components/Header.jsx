import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../UserContext";
import { extractUrlAndId } from "../utility/utils";
import { getUser, getActiveEvent } from "../utility/crudUtility";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

const Header = () => {
	const [show, setShow] = useState(false);
	const [avatar, setAvatar] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const { user, logoutUser } = useContext(UserContext);
	const location = useLocation();

	const navigate = useNavigate();

	const { data } = useQuery({
		queryKey: ["activeEvent"],
		queryFn: () => getActiveEvent(),
	});

	const logOut = () => {
		logoutUser();
		navigate("/");
	};

	useEffect(() => {
		if (user?.photoURL) {
			setAvatar(extractUrlAndId(user.photoURL).url);
			!user && setAvatar(null);
		}
		const fetchAdminStatus = async () => {
			if (user?.uid) {
				const userData = await getUser(user.uid);
				setIsAdmin(userData?.isAdmin || false);
			}
		};
		fetchAdminStatus();
	}, [user]);

	const menuVariants = {
		open: {
			opacity: 1,
			y: 0,
			height: "auto",
			transition: {
				duration: 0.2,
				ease: "easeOut",
			},
		},
		closed: {
			opacity: 0,
			height: 0,
			transition: {
				duration: 0.2,
				ease: "easeIn",
			},
		},
	};

	const linkClass = ({ isActive }) =>
		`flex items-center px-1 py-1 rounded-md transition-colors flex-none ${isActive
			? "text-rose-500 before:content-['>'] before:mr-1"
			: "text-white hover:text-rose-500"
		}`;

	return (
		<nav className="fixed top-0 left-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b text-md md:text-sm lg:text-base border-gray-700 font-mono ">
			<div className="max-w-7xl mx-auto sm:px-4 lg:px-6">
				<div className="flex flex-wrap md:flex-nowrap items-center justify-between py-2">
					<div className="flex items-center justify-between w-full md:w-auto">
						<NavLink to="/" className="flex items-center space-x-2">
							{({ isActive }) => (
								<div className="pl-2 sm:pl-0 gap-2 flex items-center">
									<img
										loading="lazy"
										src="/Listopia_Icon_v2_big.png"
										alt="Listopia"
										className="h-8 w-8 transition-transform hover:scale-105"
									/>
									<span
										onClick={() => setShow(!show)}
										className={`text-lg sm:text-xl font-bold transition-colors text-rose-500 ${isActive ? "underline" : "hover:text-rose-600"}`}
									>
										LISTOPIA
									</span>
								</div>
							)}
						</NavLink>
						<button
							onClick={() => setShow(!show)}
							className="md:hidden p-2 text-gray-400 hover:text-rose-500"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{show ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>

					<div className="hidden md:flex md:items-center sm:space-x-0 lg:space-x-6 py-1">
						{user && (
							<>
								<NavLink to="/create" className={linkClass}>
									Create List
								</NavLink>
							</>
						)}

						<NavLink to="/lists" className={linkClass}>
							Lists
						</NavLink>

						<NavLink
							to={data?.[0]?.isActive ? "/currentEvent" : "/archivedEvents"}
							className={linkClass}
						>
							{data?.[0]?.isActive ? "Current Event" : "Archived Events"}
						</NavLink>

						{user && isAdmin && (
							<NavLink
								to="/adminpanel/users"
								className={({ isActive }) =>
									`flex items-center px-1 py-1 rounded-md transition-colors text-md flex-none ${isActive || location.pathname.startsWith("/adminpanel")
										? "text-rose-500 before:content-['>'] before:mr-1"
										: "text-white hover:text-rose-500"
									}`
								}
							>
								Admin Panel
							</NavLink>


						)}

						<div className="flex items-center space-x-6 border-l border-gray-700 pl-4">
							{!user ? (
								<>
									<NavLink
										to="/register"
										className="text-white hover:text-rose-500 text-sm"
									>
										Register
									</NavLink>
									<NavLink
										to="/login"
										className="bg-rose-600 text-white px-3 py-1.5 rounded-md hover:bg-rose-700 text-sm"
									>
										Login
									</NavLink>
								</>
							) : (
								<>
								<NavLink
									to="/profile/profilesettings"
									className={({ isActive }) =>
										`flex items-center px-1 py-1 rounded-md transition-colors text-md flex-none gap-2 ${ 
										isActive || location.pathname.startsWith("/profile")
											? "text-rose-500 underline "
											: "text-white hover:text-rose-500"
										}`
									}
									>
									<div className="h-7 w-7 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
										{avatar ? (
										<img
											loading="lazy"
											className="h-7 w-7 object-cover"
											src={avatar}
											alt="Profile"
										/>
										) : (
										<span className="text-xs font-medium">
											{user?.displayName?.charAt(0).toUpperCase()}
										</span>
										)}
									</div>
									<span className="ml-1">{user?.displayName}</span> 
									</NavLink>
									<button
										onClick={logOut}
										className="text-white hover:text-rose-500 text-sm"
									>
										Logout
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{show && (
					<motion.div
						initial="closed"
						animate="open"
						exit="closed"
						variants={menuVariants}
						className="md:hidden w-full bg-gray-800/95 backdrop-blur-sm px-3 pt-2 pb-4 space-y-2 overflow-hidden"
					>
						{user && (
							<>
								<NavLink
									to="/create"
									onClick={() => setShow(false)}
									className={linkClass}
								>
									Create List
								</NavLink>
							</>
						)}
						<NavLink
							to="/lists"
							onClick={() => setShow(false)}
							className={linkClass}
						>
							Lists
						</NavLink>
						<NavLink
							to={data?.[0]?.isActive ? "/currentEvent" : "/archivedEvents"}
							onClick={() => setShow(false)}
							className={linkClass}
						>
							{data?.[0]?.isActive ? "Current Event" : "Archived Events"}
						</NavLink>
						{user && isAdmin && (
							<NavLink
								to="/adminpanel/users"
								onClick={() => setShow(false)}
								className={linkClass}
							>
								Admin Panel
							</NavLink>
						)}
						<div className="border-t border-gray-700 pt-2 mt-2 space-y-1 ">
							{!user ? (
								<>
									<NavLink
										to="/register"
										onClick={() => setShow(false)}
										className={linkClass}
									>
										Register
									</NavLink>
									<NavLink
										to="/login"
										onClick={() => setShow(false)}
										className={linkClass}
									>
										Login
									</NavLink>
								</>
							) : (
								<>
									<NavLink
										to="/profile/profilesettings"
										onClick={() => setShow(false)}
										className={linkClass}
									>
										Profile
									</NavLink>
									<button
										onClick={() => {
											logOut();
											setShow(false);
										}}
										className="w-full text-left text-white hover:text-rose-500 px-1 py-1 text-md"
									>
										Logout
									</button>
								</>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Header;
