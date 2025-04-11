import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateList from "./pages/CreateList.jsx";
import Error from "./pages/Error.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";
import Profile from "./pages/Profile.jsx";
import Lists from "./pages/Lists.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import Details from "./pages/Details.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import EventPage from "./pages/EventPage.jsx";
import Users from "./components/admin/Users.jsx";
import ReportedPosts from "./components/admin/ReportedPosts.jsx";
import CreateEvent from "./components/admin/CreateEvent.jsx";
import ProfileSettings from "./pages/ProfileSettings.jsx";
import LikedLists from "./pages/LikedLists.jsx";
import MyLists from "./pages/MyLists.jsx";
import ArchivedEventsPage from "./pages/ArchivedEventsPage.jsx";
import ArchivedEventDetails from "./pages/ArchivedEventDetails.jsx";
import SchemaViewer from "./pages/Schema_temp.jsx";

const queryClient = new QueryClient();

const AppWrapper = () => {
	const location = useLocation();
	const prevLocation = useRef(location.pathname);

	useEffect(() => {
		prevLocation.current = location.pathname;
	}, [location]);

	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route
					path="/"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.125 }}
							>
								<App />
							</motion.div>
						) : (
							<App />
						)
					}
				/>

				<Route
					path="/register"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<Register />
							</motion.div>
						) : (
							<Register />
						)
					}
				/>
				<Route
					path="/login"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<Login />
							</motion.div>
						) : (
							<Login />
						)
					}
				/>
				<Route
					path="/create"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<CreateList />
							</motion.div>
						) : (
							<CreateList />
						)
					}
				/>
				<Route
					path="/lists"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<Lists />
							</motion.div>
						) : (
							<Lists />
						)
					}
				/>
				<Route
					path="/*"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<Error />
							</motion.div>
						) : (
							<Error />
						)
					}
				/>

				<Route
					path="/profile"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<Profile />
							</motion.div>
						) : (
							<Profile />
						)
					}
				>
					<Route path="profilesettings" element={<ProfileSettings />} />
					<Route path="likedlists" element={<LikedLists />} />
					<Route path="mylists" element={<MyLists />} />
				</Route>

				<Route
					path="/details/:id"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<Details />
							</motion.div>
						) : (
							<Details />
						)
					}
				/>

				<Route
					path="/currentEvent"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<EventPage />
							</motion.div>
						) : (
							<EventPage />
						)
					}
				/>

				<Route
					path="/passwordreset"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<PasswordReset />
							</motion.div>
						) : (
							<PasswordReset />
						)
					}
				/>
				<Route
					path="/archivedEvents"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<ArchivedEventsPage />
							</motion.div>
						) : (
							<ArchivedEventsPage />
						)
					}
				/>

				<Route
					path="/archivedEvents/:eventId"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<ArchivedEventDetails />
							</motion.div>
						) : (
							<ArchivedEventDetails />
						)
					}
				/>
				<Route
					path="/Schema"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<SchemaViewer />
							</motion.div>
						) : (
							<SchemaViewer />
						)
					}
				/>
				<Route
					path="/adminpanel"
					element={
						location.pathname !== prevLocation.current ? (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1 }}
							>
								<AdminPanel />
							</motion.div>
						) : (
							<AdminPanel />
						)
					}
				>
					<Route path="users" element={<Users />} />
					<Route path="reportedposts" element={<ReportedPosts />} />
					<Route path="createevent" element={<CreateEvent />} />
				</Route>
			</Routes>
		</AnimatePresence>
	);
};

createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
			<UserProvider>
				<BrowserRouter>
					<div className="flex flex-col min-h-screen">
						<Header />
						<AppWrapper />
						<ScrollTopButton />
						<Footer />
					</div>
				</BrowserRouter>
			</UserProvider>
	</QueryClientProvider>
);
