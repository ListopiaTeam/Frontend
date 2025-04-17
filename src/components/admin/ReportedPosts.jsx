import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
	deleteList,
	fetchLists,
	getReportedLists,
	resolveReports,
} from "../../utility/crudUtility";
import { NavLink } from "react-router-dom";
import Alert from "../Alert";

const ReportedPosts = () => {
	const [selCateg, setSelCateg] = useState([]);
	const [selectedPostId, setSelectedPostId] = useState(null);
	const [alertMsg, setAlertMsg] = useState("");
	const [alertErr, setAlertErr] = useState("");

	const queryClient = useQueryClient();

	const {
		data: reportedLists,
		isLoading: loadingReportedLists,
		isError: errorReportedLists,
	} = useInfiniteQuery({
		queryKey: ["reportedLists", selCateg],
		queryFn: ({ pageParam = null }) => getReportedLists(),
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

	if (loadingReportedLists) return "Loading reported lists.";
	if (errorReportedLists) return "An error occured loading the reported lists.";

	const filteredLists = reportedLists?.pages
		.flatMap((page) => page.docs)
		.filter((doc) => doc.reports?.length > 0);

	const handleDeleteList = async () => {
		if (selectedPostId) {
			try {
				await deleteList(selectedPostId);
				queryClient.invalidateQueries(["reportedLists"]);
				setSelectedPostId(null);
				setAlertMsg("List deleted successfully.");
				setTimeout(() => setAlertMsg(""), 3000);
			} catch (error) {
				setAlertErr("Error deleting list.");
				setTimeout(() => setAlertErr(""), 3000);
			}
		}
	};

	const resolveReportedList = async (id) => {
		try {
			await resolveReports(id);
			queryClient.invalidateQueries(["reportedLists"]);
			setAlertMsg("Resolved reports successfully.");
			setTimeout(() => setAlertMsg(""), 3000);
		} catch (error) {
			setAlertErr("Error resolving list.");
			setTimeout(() => setAlertErr(""), 3000);
		}
	};

	return (
		<div>
			<h2 className="text-2xl font-semibold text-gray-800 mb-6">
				Reported Posts
			</h2>
			<div className="overflow-x-auto bg-white shadow-md rounded-lg">
				<table className="min-w-full table-auto">
					<thead>
						<tr className="text-left border-b">
							<th className="px-6 py-3 text-sm font-medium text-gray-900">
								Post Name
							</th>
							<th className="px-6 py-3 text-sm font-medium text-gray-900">
								Reasons
							</th>
							<th className="px-6 py-3 text-sm font-medium text-gray-900">
								Reported By
							</th>
							<th className="px-6 py-3 text-sm font-medium text-gray-900">
								Reported List
							</th>
							<th
								className="px-6 py-3 text-sm font-medium text-gray-900 text-center"
								colSpan={2}
							>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{filteredLists.map((post, index) => (
							<tr
								key={index}
								className={`border-b ${index % 2 == 0 ? "bg-rose-100 hover:bg-rose-300" : "hover:bg-rose-300"}`}
							>
								<td className="px-6 py-4 text-sm text-gray-900">
									{post.listData.title}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900">
									{post.reports
										.map((report) => report.content.join(", "))
										.join(", ")}
								</td>
								<td className="px-6 py-4 text-sm text-gray-900">
									{post.reports.length} people
								</td>
								<td className="px-6 py-4 text-sm">
									<NavLink
										to={`/details/${post.id}`}
										className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
									>
										View
									</NavLink>
								</td>
								<td className="px-6 py-4 text-sm">
									<button
										onClick={() => setSelectedPostId(post.id)}
										className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
									>
										Delete
									</button>
								</td>
								<td className="px-6 py-4 text-sm">
									<button
										onClick={() => resolveReportedList(post.id)}
										className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
									>
										Approve
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{selectedPostId && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
					<div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-xs sm:max-w-md shadow-xl">
						<div className="text-center">
							<div className="mx-auto flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 mb-4">
								<svg
									className="h-5 w-5 sm:h-6 sm:w-6 text-red-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
									/>
								</svg>
							</div>
							<h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
								Delete List
							</h3>
							<p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
								Are you sure you want to delete this list? This action cannot be
								undone.
							</p>
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
								<button
									onClick={() => setSelectedPostId(null)}
									className="px-4 py-2 sm:px-5 sm:py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
								>
									Cancel
								</button>
								<button
									onClick={handleDeleteList}
									className="px-4 py-2 sm:px-5 sm:py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
								>
									Confirm Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
			<Alert msg={alertMsg} err={alertErr} />
		</div>
	);
};

export default ReportedPosts;
