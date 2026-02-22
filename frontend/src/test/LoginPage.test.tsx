import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import { useAuthStore } from "../store/useAuthStore";

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return { ...actual, useNavigate: () => mockNavigate };
});

// Mock react-toastify
vi.mock("react-toastify", () => ({
	toast: { error: vi.fn() },
}));

const renderLogin = () =>
	render(
		<MemoryRouter>
			<LoginPage />
		</MemoryRouter>,
	);

describe("LoginPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuthStore.getState().logout();
	});

	it("renders the email and password fields", () => {
		renderLogin();
		expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});

	it("renders the sign in button", () => {
		renderLogin();
		expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
	});

	it("renders the demo credentials hint", () => {
		renderLogin();
		expect(screen.getByText(/demo@meditriage.com/i)).toBeInTheDocument();
	});

	// Validation

	it("shows a validation error for invalid email format", async () => {
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByLabelText(/email address/i), "notanemail");
		await user.type(screen.getByLabelText(/password/i), "demo");
		await user.click(screen.getByRole("button", { name: /sign in/i }));
		await waitFor(
			() => {
				expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});

	it("shows a validation error when password is too short", async () => {
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByLabelText(/email address/i), "demo@meditriage.com");
		await user.type(screen.getByLabelText(/password/i), "ab");
		await user.click(screen.getByRole("button", { name: /sign in/i }));
		await waitFor(
			() => {
				expect(screen.getByText(/must be 8\+ chars/i)).toBeInTheDocument();
			},
			{ timeout: 3000 },
		);
	});

	// Successful login

	it("logs in and navigates to home on valid credentials", async () => {
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByLabelText(/email address/i), "demo@meditriage.com");
		await user.type(screen.getByLabelText(/password/i), "Demo@1234");
		await user.click(screen.getByRole("button", { name: /sign in/i }));

		await waitFor(() => {
			expect(useAuthStore.getState().user).toBe("demo@meditriage.com");
			expect(mockNavigate).toHaveBeenCalledWith("/");
		});
	});

	// Failed login

	it("shows an error toast on wrong credentials", async () => {
		const { toast } = await import("react-toastify");
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByLabelText(/email address/i), "wrong@email.com");
		await user.type(screen.getByLabelText(/password/i), "Demo@1234");
		await user.click(screen.getByRole("button", { name: /sign in/i }));

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith("Invalid email or password");
			expect(mockNavigate).not.toHaveBeenCalled();
		});
	});

	it("does not set user in store on failed login", async () => {
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByLabelText(/email address/i), "wrong@email.com");
		await user.type(screen.getByLabelText(/password/i), "Demo@1234");
		await user.click(screen.getByRole("button", { name: /sign in/i }));

		await waitFor(() => {
			expect(useAuthStore.getState().user).toBeNull();
		});
	});

	// Accessibility

	it("marks the email field as aria-invalid on validation error", async () => {
		const user = userEvent.setup();
		renderLogin();
		await user.type(screen.getByLabelText(/email address/i), "bademail");
		await user.type(screen.getByLabelText(/password/i), "demo");
		await user.click(screen.getByRole("button", { name: /sign in/i }));

		await waitFor(() => {
			expect(screen.getByLabelText(/email address/i)).toHaveAttribute("aria-invalid", "true");
		});
	});
});
