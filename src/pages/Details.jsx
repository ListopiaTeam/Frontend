import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	addComment,
	deleteList,
	getUser,
	listenToComments,
	readLists,
} from "../utility/crudUtility";
import { toggleLike } from "../utility/crudUtility";
import { UserContext } from "../UserContext";
import { serverTimestamp } from "firebase/firestore";
import CommentSection from "../components/CommentSection";
import Alert from "../components/Alert";
import ReportModal from "../components/ReportModal";
import GoBackButton from "../components/GoBackButton";
import { useQuery } from "@tanstack/react-query";
import GameDetailModal from "../components/GameDetailModal";

const ListDetail = () => {
	const { id } = useParams();
	const { user } = useContext(UserContext);
	const [currentPostUser, setCurrentPostUser] = useState(null);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [currentLikes, setCurrentLikes] = useState([]);
	const [currentComment, setCurrentComment] = useState([]);
	const [alertMsg, setAlertMsg] = useState("");
	const [alertErr, setAlertErr] = useState("");

	const {
		data: list,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["list", id],
		queryFn: () => readLists(id),
	});

	const navigate = useNavigate();

	useEffect(() => {
		if (!id) return;
		const unsubscribe = listenToComments(id, setCurrentComment);
		return () => unsubscribe();
	}, [id]);

	useEffect(() => {
		if (list?.likes) {
			setCurrentLikes(list.likes);
		}
	}, [list]);

	useEffect(() => {
		window.scrollTo(window.top);
	}, []);

	useEffect(() => {
		if (currentLikes.includes(user?.uid)) {
			setIsLiked(true);
		} else {
			setIsLiked(false);
		}
	}, [currentLikes, user?.uid]);

	const handleLike = () => {
		toggleLike(id, user?.uid);
		if (isLiked) {
			setCurrentLikes(currentLikes.filter((like) => like !== user?.uid));
		} else {
			setCurrentLikes([...currentLikes, user?.uid]);
		}
		setIsLiked(!isLiked);
	};

	const fetchAdminStatus = async () => {
		if (user?.uid) {
			const userData = await getUser(user.uid);
			if (userData && userData.isAdmin) {
				setIsAdmin(true);
			} else {
				setIsAdmin(false);
			}
		}
	};
	fetchAdminStatus();

	const handleComment = () => {
		const commentText = document.querySelector("textarea").value.trim();
		if (!commentText) return;

		const newComment = {
			content: commentText,
			listId: id,
			parentId: null,
			timestamp: serverTimestamp(),
			userId: user?.uid,
			username: user?.displayName,
		};
		setCurrentComment((prevComments) => [...prevComments, newComment]);

		document.querySelector("textarea").value = "";

		if (commentText.length <= 200) {
			addComment(id, newComment);
			setAlertMsg("Comment successfully posted.");
			setTimeout(() => setAlertMsg(""), 3000);
		} else {
			setAlertErr("Comment is too long (200 max)");
			setTimeout(() => setAlertErr(""), 3000);
		}
	};

	const getPostUser = async () => {
		try {
			const user = await getUser(list?.userID);
			setCurrentPostUser(user);
		} catch (error) {
			console.error("Error fetching user:", error);
		}
	};

	useEffect(() => {
		getPostUser();
	}, [list?.userID]);

	if (!list?.games) {
		return (
			<section className="min-h-screen mt-32 max-w-4xl mx-auto text-rose-600 text-4xl font-semibold!">
				<p>List is not available!</p>
			</section>
		);
	}

	const copyToClipboard = () => {
		navigator.clipboard
			.writeText(`https://listopia-frontend.netlify.app/details/${id}`)
			.then(() => {
				setAlertMsg("URL copied to clipboard.");
				setTimeout(() => setAlertMsg(""), 3000);
			})
			.catch((err) => {
				setAlertErr("Failed to copy the URL:");
				setTimeout(() => setAlertErr(""), 3000);
			});
	};

	return (
		<main className="min-h-screen py-16 mt-16">
			<GoBackButton />
			{list && (
				<article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
					<section className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
						<header className="flex flex-wrap justify-between gap-4">
							<div className="flex gap-2">
								{list.userID !== user?.uid && (
									<ReportModal id={id} user={user} />
								)}
								{(list.userID === user?.uid || isAdmin) && (
									<button
										onClick={() => {
											deleteList(id);
											setAlertMsg("List deleted successfully!");
											setTimeout(() => {
												setAlertMsg("");
												navigate("/lists");
											}, 3000);
										}}
										className="px-6 py-2 w-fit bg-rose-500 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 transition-all"
									>
										Delete List
									</button>
								)}
							</div>
							<div className="flex items-center gap-1.5">
								{/* Share Button */}
								<button
									onClick={copyToClipboard}
									className="flex text-gray-600 hover:text-rose-700"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
										/>
									</svg>
								</button>
								{/* Like Button */}
								<button
									onClick={user && handleLike}
									disabled={!user}
									className={`flex items-center gap-1.5 group transition-colors w-fit`}
									aria-label={isLiked ? "Remove like" : "Like this game"}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className={`h-6 w-6 transition-all ${
											isLiked
												? "text-rose-500 fill-rose-500 hover:text-rose-600 hover:fill-rose-600"
												: "text-gray-900 hover:fill-rose-300 fill-transparent"
										} stroke-current stroke-[2px]`}
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
										/>
									</svg>
									<span
										className={`text-sm font-medium ${
											isLiked
												? "text-rose-500 hover:text-rose-600"
												: "text-gray-500 hover:-text-gray-600"
										}`}
									>
										{currentLikes.length}
									</span>
								</button>
							</div>
						</header>

						<section className="mb-4 mt-4 md:mt-0">
							<p className="font-bold mb-10 text-lg">
								Created by:{" "}
								<span className="text-rose-600">
									{currentPostUser?.displayName || "Deleted User"}
								</span>
							</p>
							<h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 break-words max-w-md">
								{list.title}
							</h1>
							<p className="text-base sm:text-lg text-gray-600 leading-relaxed break-words max-w-prose">
								{list.desc}
							</p>
						</section>

						{list?.categories.length > 0 && (
							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-800 mb-3">
									Categories
								</h2>
								<div className="flex flex-wrap gap-2">
									{list.categories.map((category, index) => (
										<span
											key={index}
											className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-medium transition-transform hover:scale-105"
										>
											{category}
										</span>
									))}
								</div>
							</section>
						)}

						<section>
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Games in this List
							</h2>
							<div className="space-y-6">
								{list.games.map((game) => (
									<GameDetailModal key={game.id} user={user} game={game} />
								))}
							</div>
						</section>

						<section className="mt-6">
							<h2 className="text-2xl font-bold text-gray-900 mb-6">
								Comments
							</h2>
							<div className="bg-gray-100 p-6 rounded-xl">
								<textarea
									style={{
										minHeight: "5rem",
										height: "10rem",
										maxHeight: "15rem",
									}}
									className={`${
										!user && "hidden"
									} w-full p-3 rounded-lg border border-gray-300 focus:ring-rose-500 focus:border-rose-500`}
									rows="4"
									maxLength="120"
									placeholder="Add a comment..."
								/>
								<button
									onClick={handleComment}
									className={`${
										!user && "hidden"
									} mt-3 px-6 py-2 bg-rose-500 text-white font-semibold rounded-lg shadow-md hover:bg-rose-600 transition-all`}
								>
									Post Comment
								</button>
								<CommentSection
									currentComment={currentComment}
									listId={id}
									userUid={user?.uid}
									isAdmin={isAdmin}
								/>
							</div>
						</section>
					</section>
				</article>
			)}
			<Alert msg={alertMsg} err={alertErr} />
		</main>
	);
};

export default ListDetail;
