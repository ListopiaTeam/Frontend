import { render, screen } from "@testing-library/react";
import k from "../pages/Login"
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Kiserlet from "../pages/Kiserlet";

describe("Login panel", () => {
  it("should render login", () => {
    render(
       
            <Kiserlet/>
        
);
    expect(screen.getByText(/kiserlet/i)).toBeInTheDocument();
  });
});
