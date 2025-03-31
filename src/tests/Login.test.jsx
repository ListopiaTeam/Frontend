import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { UserContext } from "../UserContext";

describe("Login panel", () => {
	it("should render login", () => {
		render(
			<UserContext.Provider value={{ message: "okay" }}>
				<MemoryRouter>
					<Login />
				</MemoryRouter>
			</UserContext.Provider>,
		);
		expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
	});
});
