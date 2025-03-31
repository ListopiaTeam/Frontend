import React from "react";

const Footer = () => {
	return (
		<footer className="bg-gray-900 text-gray-300 mt-auto py-8">
			<div className="container mx-auto flex flex-col items-center lg:flex-row lg:justify-between px-6">
				<div className="flex items-center gap-4">
					<img
						className="w-20 h-20 rounded-lg shadow-lg"
						src="/Listopia_Icon_v2_big.png"
						alt="Listopia Logo"
					/>
					<p className="max-w-md text-sm leading-relaxed font-mono">
						Listopia is a social platform for gamers to share lists of their
						favorite games.
					</p>
				</div>
				<div className="mt-6 lg:mt-0 text-xs text-center lg:text-right font-mono border-t lg:border-t-0 border-gray-700 pt-4 lg:pt-0  lg:mr-20">
					<p className="text-nowrap">
						&copy; ListopiaTeam {new Date().getFullYear()}.{" "}
						<span>All rights reserved.</span>
					</p>
					<p>
						Made By{" "}
						<a
							className="text-rose-500 hover:underline"
							href="https://github.com/ListopiaTeam/"
						>
							ListopiaTeam
						</a>{" "}
						using{" "}
						<a
							className="text-rose-500 hover:underline"
							href="https://rawg.io/"
						>
							RAWG
						</a>
						.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
