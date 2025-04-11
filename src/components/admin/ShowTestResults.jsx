import React from "react";
import testResults from "../../../test-results.json";

export default function ShowTestResults() {
	return (
		<div className="p-4">
			<h1 className="text-xl font-bold">Test Summary</h1>

			<ul className="mt-4 space-y-2">
				{testResults.testResults.map((testFile, index) => (
					<li key={index} className="border p-2 rounded-md">
						<h2 className="font-semibold">{testFile.name}</h2>
						<ul className="ml-4 mt-1 list-disc">
							{testFile.assertionResults.map((assertion, i) => (
								<li key={i}>
									{assertion.fullName} —
									<span
										className={`ml-1 font-bold ${
											assertion.status === "passed"
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{assertion.status}
									</span>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</div>
	);
}
