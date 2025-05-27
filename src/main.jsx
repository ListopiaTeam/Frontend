import { useEffect, useRef, lazy } from "react";
import { createRoot } from "react-dom/client";
import {
	BrowserRouter,
	Route,
	Routes,
	useLocation,
	Navigate,
} from "react-router-dom"; // Import Navigate
import { AnimatePresence, motion } from "framer-motion";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ShowTestResults from "./pages/admin/ShowTestResults.jsx";

const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const CreateList = lazy(() => import("./pages/CreateList.jsx"));
const Error = lazy(() => import("./pages/Error.jsx"));
const Header = lazy(() => import("./components/Header.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));
const ScrollTopButton = lazy(() => import("./components/ScrollTopButton.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Lists = lazy(() => import("./pages/Lists.jsx"));
const PasswordReset = lazy(() => import("./pages/PasswordReset.jsx"));
const Details = lazy(() => import("./pages/Details.jsx"));
const AdminPanel = lazy(() => import("./pages/AdminPanel.jsx"));
const EventPage = lazy(() => import("./pages/EventPage.jsx"));
const Users = lazy(() => import("./pages/admin/Users.jsx"));
const ReportedPosts = lazy(() => import("./pages/admin/ReportedPosts.jsx"));
const CreateEvent = lazy(() => import("./pages/admin/CreateEvent.jsx"));
const ProfileSettings = lazy(
	() => import("./pages/profile/ProfileSettings.jsx"),
);
const LikedLists = lazy(() => import("./pages/profile/LikedLists.jsx"));
const MyLists = lazy(() => import("./pages/profile/MyLists.jsx"));
const ArchivedEventsPage = lazy(() => import("./pages/ArchivedEventsPage.jsx"));
const ArchivedEventDetails = lazy(
	() => import("./pages/ArchivedEventDetails.jsx"),
);
const SchemaViewer = lazy(() => import("./pages/admin/Schema_temp.jsx"));

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
					{/* Redirect /profile to /profile/profilesettings */}
					<Route index element={<Navigate to="profilesettings" replace />} />
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
					{/* Redirect /adminpanel to /adminpanel/users */}
					<Route index element={<Navigate to="users" replace />} />
					<Route path="users" element={<Users />} />
					<Route path="reportedposts" element={<ReportedPosts />} />
					<Route path="createevent" element={<CreateEvent />} />
					<Route
						path="schema"
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
						path="tests"
						element={
							location.pathname !== prevLocation.current ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1 }}
								>
									<ShowTestResults />
								</motion.div>
							) : (
								<ShowTestResults />
							)
						}
					/>
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
	</QueryClientProvider>,
);
