import { useContext, useEffect, useState } from "react";

import { UserContext } from "../UserContext";

import { serverTimestamp } from "firebase/firestore";

import { addComment, deleteComment, getUser } from "../utility/crudUtility";

import { extractUrlAndId } from "../utility/utils";
import Alert from "../components/Alert.jsx";

const CommentSection = ({ currentComment, listId, userUid, isAdmin }) => {
	const [replyInputs, setReplyInputs] = useState({});

	const [showReplyInput, setShowReplyInput] = useState({});

	const [showReplies, setShowReplies] = useState({});

	const [avatar, setAvatar] = useState(null);

	const { user } = useContext(UserContext);

	const [userData, setUserData] = useState({});
	const [alertMsg, setAlertMsg] = useState("");
	const [alertErr, setAlertErr] = useState("");

	useEffect(() => {
		const fetchUsers = async () => {
			const users = {};

			for (const comment of currentComment) {
				if (!userData[comment.userId]) {
					const user = await getUser(comment.userId);

					users[comment.userId] = user || { displayName: "Unknown User" };
				}
			}

			setUserData((prevData) => ({ ...prevData, ...users }));
		};

		fetchUsers();
	}, [currentComment]);

	useEffect(() => {
		if (user?.photoURL) {
			setAvatar(extractUrlAndId(user.photoURL).url);

			!user && setAvatar(null);
		}
	}, [user, user?.photoURL]);

	const commentTree = currentComment.reduce((acc, comment) => {
		if (comment.parentId) {
			acc[comment.parentId] = acc[comment.parentId] || [];

			acc[comment.parentId].push(comment);
		}

		return acc;
	}, {});

	const toggleReplyInput = (commentId) => {
		setShowReplyInput((prev) => ({
			...prev,

			[commentId]: !prev[commentId],
		}));
	};

	const toggleReplies = (commentId) => {
		setShowReplies((prev) => ({
			...prev,

			[commentId]: !prev[commentId],
		}));
	};

	const handleReplyChange = (commentId, text) => {
		setReplyInputs((prev) => ({
			...prev,

			[commentId]: text,
		}));
	};

	const handleReplySubmit = (commentId) => {
		const replyText = replyInputs[commentId]?.trim();

		if (!replyText) return;

		const newReply = {
			content: replyText,

			listId: listId,

			parentId: commentId,

			timestamp: serverTimestamp(),

			userId: user?.uid,

			username: user?.displayName,
		};

		if (newReply.content.length <= 120) {
			addComment(listId, newReply);
			setAlertMsg("Comment successfully posted.");
			setTimeout(() => setAlertMsg(""), 3000);
		}else
		{
			setAlertErr("Comment is too long (200 max)");
			setTimeout(() => setAlertErr(""), 3000);
		}

		setReplyInputs((prev) => ({
			...prev,

			[commentId]: "",
		}));

		setShowReplyInput((prev) => ({
			...prev,

			[commentId]: false,
		}));
	};

	return (
		<div className="mt-12 space-y-6">
			{currentComment.length > 0 ? (
				currentComment

					.filter((comment) => !comment.parentId)

					.map((comment) => (
						<div key={comment.id || "temp"} className="group relative">
							<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-rose-100 transition-colors">
								<div className="flex items-start gap-3">
									<div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
										{userData[comment.userId]?.photoURL ? (
											<img
												loading="lazy"
												className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center"
												src={userData[comment.userId]?.photoURL.substring(
													0,
													userData[comment.userId]?.photoURL.lastIndexOf("/")
												)}
												alt="Profile picture"
											/>
										) : (
											<span className="text-sm font-medium">
												{comment.username?.charAt(0).toUpperCase()}
											</span>
										)}
									</div>

									<div className="flex-1 min-w-0">
										<div className="flex items-baseline gap-2">
											<h3 className="text-sm font-semibold text-gray-900">
												{userData[comment.userId]?.displayName}
											</h3>

											<span className="text-xs text-gray-500">
												{comment.timestamp?.seconds
													? new Date(
															comment.timestamp.seconds * 1000
													  ).toLocaleString()
													: "Just now"}
											</span>
										</div>

										<p className="mt-1 text-gray-700 text-sm break-words">
											{comment.content}
										</p>

										<div className="mt-2 flex items-center gap-4">
											<button
												onClick={() => toggleReplyInput(comment.id)}
												className={`${
													!user && "hidden"
												} text-xs font-medium text-gray-500 hover:text-gray-700`}
											>
												Reply
											</button>

											{(userUid === comment.userId || isAdmin) && (
												<button
													onClick={() =>
														deleteComment(comment.listId, comment.id)
													}
													className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
												>
													Delete comment
												</button>
											)}

											{commentTree[comment.id] && (
												<button
													onClick={() => toggleReplies(comment.id)}
													className={`${
														!user && "hidden"
													} text-xs font-medium text-gray-500 hover:text-gray-700`}
												>
													{showReplies[comment.id]
														? "Hide replies"
														: `View ${commentTree[comment.id].length} ${
																commentTree[comment.id].length === 1
																	? "reply"
																	: "replies"
														  }`}
												</button>
											)}
										</div>

										{showReplyInput[comment.id] && (
											<div className="mt-4 pl-4 border-l-2 border-rose-100">
												<textarea
													value={replyInputs[comment.id] || ""}
													onChange={(e) =>
														handleReplyChange(comment.id, e.target.value)
													}
													className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
													placeholder="Write your reply..."
													rows="2"
												/>

												<div className="mt-2 flex gap-2">
													<button
														onClick={() => handleReplySubmit(comment.id)}
														className="px-3 py-1.5 text-xs font-medium bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
													>
														Post Reply
													</button>

													<button
														onClick={() => toggleReplyInput(comment.id)}
														className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800"
													>
														Cancel
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							{showReplies[comment.id] && commentTree[comment.id] && (
								<div className="mt-4 ml-8 pl-4 border-l-2 border-gray-100 space-y-4">
									{commentTree[comment.id].map((reply) => (
										<div
											key={reply.id}
											className="bg-gray-50 p-4 rounded-lg border border-gray-100"
										>
											<div className="flex items-start gap-3">
												<div className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
													{userData[comment.userId]?.photoURL ? (
														<img
															loading="lazy"
															className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center"
															src={avatar}
															alt="Profile picture"
														/>
													) : (
														<span className="text-sm font-medium">
															{comment.username?.charAt(0).toUpperCase()}
														</span>
													)}
												</div>

												<div className="flex-1 min-w-0">
													<div className="flex items-baseline gap-2">
														<h3 className="text-xs font-semibold text-gray-900">
															{userData[reply.userId]?.displayName}
														</h3>

														<span className="text-xs text-gray-500">
															{reply.timestamp?.seconds
																? new Date(
																		reply.timestamp.seconds * 1000
																  ).toLocaleString()
																: "Just now"}
														</span>
													</div>

													<p className="mt-1 text-gray-700 text-sm break-words">
														{reply.content}
													</p>

													{(reply.userId === userUid || isAdmin) && (
														<button
															onClick={() =>
																deleteComment(reply.listId, reply.id)
															}
															className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
														>
															Delete comment
														</button>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					))
			) : (
				<div className="text-center py-8">
					<div className="mb-2 text-gray-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-12 w-12 mx-auto"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							/>
						</svg>
					</div>

					<p className="text-gray-500 text-sm font-medium">
						No comments yet. Be the first to share your thoughts!
					</p>
				</div>
			)}
			<Alert msg={alertMsg} err={alertErr} />
		</div>
	);
};

export default CommentSection;
