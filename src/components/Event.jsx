import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getActiveEvent } from "../utility/crudUtility";
import { NavLink } from "react-router-dom";
import { UserContext } from "../UserContext";

const Event = () => {
	const { user } = useContext(UserContext);
	const { data, error, isLoading } = useQuery({
		queryKey: ["activeEvent"],
		queryFn: () => getActiveEvent(),
	});

	const eventEndDate = new Date(data?.[0]?.endDate?.seconds * 1000);
	const currentDate = new Date();
	const daysRemaining = Math.ceil(
		(eventEndDate - currentDate) / (1000 * 3600 * 24),
	);

	const hasActiveEvent = data && data.length > 0;
	const isButtonDisabled = !user || !hasActiveEvent;

	return (
		<section
			style={{
				backgroundImage: `url(${data?.[0]?.eventImage || "Banner.jpg"})`,
			}}
			className={`relative min-h-[80vh] bg-cover bg-center bg-no-repeat bg-fixed`}
		>
			<div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-tr from-gray-900/95 via-gray-900/70 to-transparent"></div>
			<div className="relative mx-auto max-w-screen-xl px-4 py-24 sm:px-6 flex h-[80vh] items-center justify-center sm:justify-start lg:px-8">
				<div className="max-w-2xl text-center sm:text-left space-y-8">
					<div className="space-y-4">
						<h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
							<span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
								Listopia
							</span>
							<strong className="block mt-3 text-3xl sm:text-5xl font-extrabold text-white">
								Create Lists!
							</strong>
						</h1>

						<p className="text-lg sm:text-xl text-gray-200 max-w-2xl leading-relaxed">
							Submit a list to help other people discover new things!
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
						<NavLink
							to={`${user ? "/create" : "/"}`}
							className={`${isButtonDisabled ? "bg-gray-400 cursor-not-allowed hover:scale-100" : "bg-rose-600 hover:bg-rose-700 hover:scale-105"} group relative flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white rounded-lg shadow-lg transition-all transform`}
						>
							<span>Join the Event</span>
							{!isButtonDisabled && (
								<svg
									className="w-4 h-4 group-hover:translate-x-1 transition-transform"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 8l4 4m0 0l-4 4m4-4H3"
									/>
								</svg>
							)}
						</NavLink>

						<NavLink
							to="/currentEvent"
							className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm font-semibold text-gray-200 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Event Details</span>
						</NavLink>

						<NavLink
							to="/archivedEvents"
							className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-sm font-semibold text-gray-200 bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all border border-white/20 hover:border-white/30"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Archived Events</span>
						</NavLink>
					</div>
					{hasActiveEvent && data[0].endDate && (
						<div className="mt-12 flex items-center justify-center sm:justify-start gap-4 text-gray-300 text-sm">
							<div className="flex items-center gap-2">
								<svg
									className="w-5 h-5 text-rose-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>{daysRemaining > 1 ? `${daysRemaining} Days Remaining` : `${daysRemaining} Day Remaining`}</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default Event;