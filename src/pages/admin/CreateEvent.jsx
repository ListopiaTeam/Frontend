import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // make sure to import
import Alert from "../../components/Alert";
import { uploadFile } from "../../utility/uploadFile";
import { addEvent } from "../../utility/crudUtility";
import { getActiveEvent } from "../../utility/crudUtility";

const CreateEvent = () => {
	const [message, setMessage] = useState([]);
	const [date, setDate] = useState();
	useEffect(() => {
		setDate(new Date().toISOString().split("T")[0]);
	}, []);

	const { data } = useQuery({
		queryKey: ["activeEvent"],
		queryFn: () => getActiveEvent(),
	});

	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const handleEventCreation = async (formData) => {
		try {
			const file = formData?.file ? formData.file[0] : null;
			const { url } = file ? await uploadFile(file) : {};

			const payload = {
				title: formData.eventName,
				desc: formData.eventDesc,
				endDate: new Date(formData.eventDate),
				eventImage: url,
				submitedLists: [],
				isActive: true,
			};

			await addEvent(payload, setMessage);
			reset(); // ✅ Clear the form
			setTimeout(() => {
				setMessage("");
			}, 3000);
			queryClient.invalidateQueries({ queryKey: ["activeEvent"] }); // optional: refetch activeEvent
		} catch (error) {
			console.log(error);
			setTimeout(() => {
				setMessage("");
			}, 3000);
		}
	};

	return (
		<div>
			<h2 className="text-2xl font-semibold text-gray-800 mb-6">
				Create Event
			</h2>
			<div className="bg-white shadow-md p-6 rounded-lg">
				<form onSubmit={handleSubmit(handleEventCreation)}>
					<div className="mb-4">
						<label
							htmlFor="eventName"
							className="block text-sm font-medium text-gray-700"
						>
							Event Name
						</label>
						<input
							type="text"
							id="eventName"
							{...register("eventName", { required: "Event name is required" })}
							className="mt-1 block w-full p-3 border border-gray-300 rounded-lg mb-4"
						/>
						{errors.eventName && (
							<p className="text-red-500 text-sm">{errors.eventName.message}</p>
						)}
					</div>

					<div className="mb-4">
						<label
							htmlFor="eventDesc"
							className="block text-sm font-medium text-gray-700"
						>
							Event Description
						</label>
						<input
							type="text"
							id="eventDesc"
							{...register("eventDesc", {
								required: "Event description is required",
							})}
							className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
						/>
						{errors.eventDesc && (
							<p className="text-red-500 text-sm">{errors.eventDesc.message}</p>
						)}
					</div>

					<div className="mb-4">
						<label
							htmlFor="eventDate"
							className="block text-sm font-medium text-gray-700"
						>
							Event Date
						</label>
						<input
							type="date"
							id="eventDate"
							min={date}
							{...register("eventDate", { required: "Event date is required" })}
							className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
						/>
						{errors.eventDate && (
							<p className="text-red-500 text-sm">{errors.eventDate.message}</p>
						)}
					</div>

					<div className="mb-4">
						<label
							htmlFor="file"
							className="block text-sm font-medium text-gray-700"
						>
							Event Image
						</label>
						<input
							type="file"
							{...register("file", { required: "Event image is required" })}
							className="mt-1 block w-full p-3 border border-gray-300 rounded-lg"
						/>
						{errors.file && (
							<p className="text-red-500 text-sm">{errors.file.message}</p>
						)}
					</div>

					<button
						type="submit"
						disabled={data?.[0]?.isActive}
						className={`w-full px-6 py-2 font-semibold rounded-lg transition-all ${
							data?.[0]?.isActive
								? "bg-gray-400 cursor-not-allowed text-white"
								: "bg-rose-500 text-white hover:bg-rose-600"
						}`}
					>
						Create Event
					</button>
				</form>
			</div>
			{message.success === true ? (
				<Alert msg={message.message} />
			) : (
				message && <Alert err={message.message} />
			)}
		</div>
	);
};

export default CreateEvent;
