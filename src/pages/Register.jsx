import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Alert from "../components/Alert";

const Register = () => {
	const { signUpUser, message, setMessage, user } = useContext(UserContext);
	const [showPassword, setShowPassword] = useState(false);
	const navigate = useNavigate();

	const handleRegistration = (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		 const username = data.get("displayName");

		if (username.length < 5 || username.length > 20) {
			setMessage({ err: "Username must be between 5 and 20 characters." });
			setTimeout(() => {
				setMessage({err: ""})
			}, 5000)
		}

		signUpUser(
			data.get("email"),
			data.get("password"),
			data.get("displayName"),
		);
	};

	// Go back to home page once user is created
	user && setTimeout(() => (setMessage(""), navigate("/")), 5000);

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
			<div className="max-w-md w-full mx-auto">
				<div className="bg-white rounded-2xl shadow-md p-8 sm:p-10">
					<div className="mb-8 text-center">
						<h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
						<p className="mt-2 text-sm text-gray-600">
							Already have an account?{" "}
							<NavLink
								to="/login"
								className="font-medium text-rose-600 hover:text-rose-500 transition-colors"
							>
								Sign in
							</NavLink>
						</p>
					</div>

					<form onSubmit={handleRegistration} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Username
							</label>
							<div className="relative">
								<input
									type="text"
									name="displayName"
									required
									minLength={5}
									maxLength={20}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
									placeholder="Enter your username"
								/>
								<div className="absolute inset-y-0 right-3 flex items-center pr-3 pointer-events-none">
									<svg
										className="h-5 w-5 text-gray-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
									</svg>
								</div>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<div className="relative">
								<input
									type="email"
									name="email"
									required
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
									placeholder="you@example.com"
								/>
								<div className="absolute inset-y-0 right-3 flex items-center pr-3 pointer-events-none">
									<svg
										className="h-5 w-5 text-gray-400"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
										<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
									</svg>
								</div>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									required
									minLength={6}
									className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all pr-12"
									placeholder="••••••••"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-3 flex items-center pr-3 text-gray-400 hover:text-gray-500"
								>
									{showPassword ? (
										<svg
											className="h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
											/>
										</svg>
									) : (
										<svg
											className="h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
									)}
								</button>
							</div>
						</div>

						<button
							type="submit"
							className="w-full bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors shadow-sm"
						>
							Create Account
						</button>
					</form>
				</div>

				{/* Alert Component */}
				{message?.signup ? (
					<Alert msg={message.signup} />
				) : (
					message?.err && <Alert err={message.err} />
				)}
			</div>
		</div>
	);
};

export default Register;
