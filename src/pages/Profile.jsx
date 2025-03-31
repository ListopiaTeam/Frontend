import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { extractUrlAndId } from "../utility/utils";
import { deletePhoto, uploadFile } from "../utility/uploadFile.js";
import Alert from "../components/Alert.jsx";
import "../index.css";

export default function Profile() {
	const { user, updateCredentials, deleteAccount, logoutUser } =
		useContext(UserContext);
	const [avatar, setAvatar] = useState(null);
	const [showPopup, setShowPopup] = useState(false);
	const [alertMsg, setAlertMsg] = useState("");
	const [alertErr, setAlertErr] = useState("");
	const navigate = useNavigate();
	const userImgId = user?.photoURL ? extractUrlAndId(user.photoURL).id : null;

	useEffect(() => {
		user?.photoURL && setAvatar(extractUrlAndId(user.photoURL).url);
	}, [user]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			displayName: user?.displayName || "",
		},
	});

	const onSubmit = async (data) => {
		try {
			userImgId && (await deletePhoto(userImgId));
			const file = data?.file ? data.file[0] : null;

			const { url, id } = file ? await uploadFile(file) : {};
			updateCredentials(
				data.displayName,
				file ? `${url}/${id}` : user.photoURL,
			);
			setAlertMsg("Profile updated successfully!");
			setTimeout(() => setAlertMsg(""), 3000);
		} catch (error) {
			console.error(error);
			setAlertErr("Failed to update profile");
			setTimeout(() => setAlertErr(""), 3000);
		}
	};

	const handleDelete = async () => {
		try {
			if (userImgId) {
				await deletePhoto(userImgId);
			}
			await deleteAccount();
			await logoutUser();
			navigate("/");
		} catch (error) {
			console.error("Deletion failed:", error);
		}
	};

	useEffect(() => {
		if (user === undefined) return;
		if (!user) navigate("/");
	}, [user]);

	return (
		<div className="mt-32 mb-32 flex justify-center">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="max-w-lg m-auto gap-5 flex flex-col mx-5"
			>
				<h2 className="text-center text-3xl font-semibold">Profile</h2>

				{avatar && (
					<div className="w-24 h-24 mx-auto mb-5 border-2 border-rose-600 rounded-lg overflow-hidden flex items-center justify-center bg-gray-700">
						<img
							src={avatar}
							alt="Profile"
							className="w-full h-full object-cover"
						/>
					</div>
				)}

				<label className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
					<input
						{...register("displayName", { required: "Username is required" })}
						placeholder="Username"
						className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
						minLength={5}
						maxLength={20}
					/>
					<span className="absolute start-3 top-3 -translate-y-1/2 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs text-slate-600 select-none">
						Username
					</span>
				</label>
				{errors.displayName && (
					<p className="text-red-400 mt-2">{errors.displayName.message}</p>
				)}

				<label className="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-4 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
					<input
						type="file"
						{...register("file")}
						onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
						className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
					/>
					<span className="absolute start-3 top-2 -translate-y-1/2 text-xs transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs text-slate-600 select-none">
						Profile Picture
					</span>
				</label>
				{errors.file && (
					<p className="text-red-400 mt-2">{errors.file.message}</p>
				)}

				<button
					className="block rounded border-solid bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow hover:bg-rose-700 focus:outline-none focus:ring sm:w-auto"
					type="submit"
				>
					Save Changes
				</button>

				<button
					className="block rounded border border-rose-600 px-12 py-3 text-sm font-medium text-rose-600 shadow-sm hover:bg-rose-600 hover:text-white focus:outline-none focus:ring focus:ring-rose-300 active:bg-rose-700 sm:w-auto shake"
					type="button"
					onClick={() => setShowPopup(true)}
				>
					Delete Account
				</button>
			</form>

			{showPopup && (
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
								Delete Account
							</h3>
							<p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">
								Are you sure you want to delete your account? All data will be
								permanently removed.
							</p>
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
								<button
									onClick={() => setShowPopup(false)}
									className="px-4 py-2 sm:px-5 sm:py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
								>
									Cancel
								</button>
								<button
									onClick={handleDelete}
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
}
