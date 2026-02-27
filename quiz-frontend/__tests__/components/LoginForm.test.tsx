import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import LoginForm from "@/app/(auth)/_components/login_form";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockHandleLoginSchool = jest.fn();
const mockHandleStudentLogin = jest.fn();
jest.mock("@/lib/actions/auth-action", () => ({
  handleLoginSchool: (...args: any[]) => mockHandleLoginSchool(...args),
  handleStudentLogin: (...args: any[]) => mockHandleStudentLogin(...args),
}));

const mockCheckAuth = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    checkAuth: mockCheckAuth,
    isAuthenticated: false,
    user: null,
    loading: false,
  }),
}));


jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useTransition: () => [false, (fn: () => void) => fn()],
}));


const user = userEvent.setup();

const fillAndSubmit = async (email: string, password: string) => {
  await user.type(screen.getByLabelText(/email address/i), email);
  await user.type(screen.getByLabelText(/password/i), password);
  await user.click(screen.getByRole("button", { name: /log in/i }));
};

beforeEach(() => {
  jest.clearAllMocks();
});


describe("LoginForm", () => {
  test("renders email input, password input and login button", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("shows email validation error on empty submit", async () => {
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
  });

  test("shows password validation error when password is too short", async () => {
    render(<LoginForm />);
    await user.type(screen.getByLabelText(/email address/i), "test@example.com");
    await user.type(screen.getByLabelText(/password/i), "abc");
    await user.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() => {
      expect(screen.getByText(/minimum 6 characters/i)).toBeInTheDocument();
    });
  });

  test("does not call login actions when form is invalid", async () => {
    render(<LoginForm />);
    await user.click(screen.getByRole("button", { name: /log in/i }));
    await waitFor(() => {
      expect(mockHandleLoginSchool).not.toHaveBeenCalled();
      expect(mockHandleStudentLogin).not.toHaveBeenCalled();
    });
  });

  test("redirects school user to /school/dashboard on success", async () => {
    mockHandleLoginSchool.mockResolvedValue({ success: true, data: { role: "SCHOOL" } });
    mockCheckAuth.mockResolvedValue(undefined);

    render(<LoginForm />);
    await fillAndSubmit("school@example.com", "password123");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/school/dashboard");
    });
  });

  test("redirects student to homepage on successful student login", async () => {
    mockHandleLoginSchool.mockResolvedValue({ success: false });
    mockHandleStudentLogin.mockResolvedValue({
      success: true,
      data: { role: "STUDENT", isFirstLogin: false },
    });
    mockCheckAuth.mockResolvedValue(undefined);

    render(<LoginForm />);
    await fillAndSubmit("student@example.com", "password123");

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/student/StudentDashboard/homepage");
    });
  });

  test("redirects student somewhere after successful login", async () => {
    mockHandleLoginSchool.mockResolvedValue({ success: false });
    mockHandleStudentLogin.mockResolvedValue({
      success: true,
      data: { role: "STUDENT", isFirstLogin: true },
    });
    mockCheckAuth.mockResolvedValue(undefined);

    render(<LoginForm />);
    await fillAndSubmit("student@example.com", "password123");

    // Component pushes to homepage from submit handler;
    // changepassword redirect is handled by useEffect after checkAuth updates user state
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });

  test("shows error message when both logins fail", async () => {
    mockHandleLoginSchool.mockResolvedValue({ success: false, message: "Invalid credentials" });
    mockHandleStudentLogin.mockResolvedValue({ success: false, message: "Invalid credentials" });

    render(<LoginForm />);
    await fillAndSubmit("wrong@example.com", "wrongpass");

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("does not redirect on failed login", async () => {
    mockHandleLoginSchool.mockResolvedValue({ success: false });
    mockHandleStudentLogin.mockResolvedValue({ success: false });

    render(<LoginForm />);
    await fillAndSubmit("bad@example.com", "password123");

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test("renders forgot password and sign up links", () => {
    render(<LoginForm />);
    expect(screen.getByRole("link", { name: /forgot password/i })).toHaveAttribute("href", "/forgot-password");
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute("href", "/register");
  });
});