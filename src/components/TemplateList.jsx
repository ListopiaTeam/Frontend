const TemplateList = ({ src, selectedTags, onTagRemove, onTagModalOpen }) => {
	return (
		<div className="group relative block overflow-hidden shadow-xl border border-black max-w-md mx-auto w-full">
			<div className="relative w-full h-48 bg-gray-300 flex items-center justify-center select-none">
				{src ? (
					<img
						loading="lazy"
						src={src}
						alt=""
						className="w-full h-full object-cover"
					/>
				) : (
					<span className="absolute text-black text-3xl font-bold text-center px-4">
						Image Gets Selected From First Game In The List
					</span>
				)}
			</div>
			<div className="relative border border-gray-100 bg-white p-6">
				<div className="flex flex-wrap gap-2">
					<span
						onClick={onTagModalOpen}
						className="whitespace-nowrap bg-rose-400 px-3 py-1.5 text-xs font-mono font-medium cursor-pointer select-none hover:bg-rose-500"
					>
						SELECT TAGS
					</span>
					{selectedTags.map((tag) => (
						<span
							key={tag}
							className="flex items-center gap-1 bg-rose-100 px-3 py-1.5 text-xs font-mono font-medium cursor-pointer select-none hover:bg-rose-200 rounded"
							onClick={() => onTagRemove(tag)}
						>
							{tag}
							<span className="text-rose-500">×</span>
						</span>
					))}
				</div>
				<div className="flex flex-col">
					<input
						className="mt-4 text-lg font-mono font-bold text-gray-900 placeholder:text-gray-800 border-bottom-1 outline-none"
						type="text"
						id="title"
						placeholder="Edit List Title"
						minLength={5}
						maxLength={35}
					/>
					<hr />
					<textarea
						style={{ minHeight: "5rem", height: "10rem", maxHeight: "15rem" }}
						className="mt-4 text-md font-medium text-gray-900 placeholder:text-gray-800 border-bottom-1 outline-none"
						type="text"
						id="description"
						placeholder="Edit List Description"
						minLength={5}
						maxLength={200}
					/>
				</div>
			</div>
		</div>
	);
};

export default TemplateList;
