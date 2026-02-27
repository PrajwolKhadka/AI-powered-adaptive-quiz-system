import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterForm from "@/app/(auth)/_components/register_form";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

const mockHandleRegisterSchool = jest.fn();
jest.mock("@/lib/actions/auth-action", () => ({
  handleRegisterSchool: (...args: any[]) => mockHandleRegisterSchool(...args),
}));

const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: (...args: any[]) => mockToastSuccess(...args),
    error: (...args: any[]) => mockToastError(...args),
  },
}));

const user = userEvent.setup();

const fillForm = async (overrides: Record<string, string> = {}) => {
  const values = {
    schoolName: "Test School",
    email: "school@example.com",
    contact: "9800000000",
    instituteType: "private",
    city: "Kathmandu",
    district: "Bagmati",
    pan: "ABC123456",
    password: "Password123",
    confirmPassword: "Password123",
    ...overrides,
  };

  await user.type(screen.getByLabelText(/school.*name/i), values.schoolName);
  await user.type(screen.getByLabelText(/email address/i), values.email);
  await user.type(screen.getByLabelText(/contact number/i), values.contact);
  await user.selectOptions(screen.getByLabelText(/institute type/i), values.instituteType);
  await user.type(screen.getByLabelText(/^city$/i), values.city);
  await user.type(screen.getByLabelText(/^district$/i), values.district);
  await user.type(screen.getByLabelText(/pan number/i), values.pan);
  await user.type(screen.getByLabelText(/^password$/i), values.password);
  await user.type(screen.getByLabelText(/confirm password/i), values.confirmPassword);
};

beforeEach(() => {
  jest.clearAllMocks();
});


describe("RegisterForm", () => {
  test("renders all form fields and submit button", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/school.*name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contact number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/institute type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^city$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^district$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pan number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  test("shows validation errors when form is submitted empty", async () => {
    render(<RegisterForm />);
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/school name must be at least/i)).toBeInTheDocument();
    });
  });

  test("shows error when passwords do not match", async () => {
    render(<RegisterForm />);
    await fillForm({ password: "Password123", confirmPassword: "Different123" });
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
    });
  });

  test("shows error when contact number is invalid", async () => {
    render(<RegisterForm />);
    await fillForm({ contact: "123" });
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/valid 10-digit/i)).toBeInTheDocument();
    });
  });

  test("shows error when password is too short", async () => {
    render(<RegisterForm />);
    await fillForm({ password: "short", confirmPassword: "short" });
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    });
  });

  test("does not call handleRegisterSchool when form is invalid", async () => {
    render(<RegisterForm />);
    await user.click(screen.getByRole("button", { name: /create account/i }));
    await waitFor(() => {
      expect(mockHandleRegisterSchool).not.toHaveBeenCalled();
    });
  });

  test("calls handleRegisterSchool with correct payload on valid submit", async () => {
    mockHandleRegisterSchool.mockResolvedValue({ success: true, message: "Registration successful" });

    render(<RegisterForm />);
    await fillForm();
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockHandleRegisterSchool).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test School",
          email: "school@example.com",
          contactNumber: "9800000000",
          instituteType: "PRIVATE",
          location: { city: "Kathmandu", district: "Bagmati" },
        })
      );
    });
  });

  test("shows success toast and redirects to /login on success", async () => {
    mockHandleRegisterSchool.mockResolvedValue({ success: true, message: "Registration successful" });

    render(<RegisterForm />);
    await fillForm();
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Registration successful");
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  test("shows error toast when registration fails", async () => {
    mockHandleRegisterSchool.mockResolvedValue({ success: false, message: "Email already exists" });

    render(<RegisterForm />);
    await fillForm();
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Email already exists");
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  test("shows error toast when action throws", async () => {
    mockHandleRegisterSchool.mockRejectedValue(new Error("Network error"));

    render(<RegisterForm />);
    await fillForm();
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Network error");
    });
  });

  test("sends instituteType in uppercase to the API", async () => {
    mockHandleRegisterSchool.mockResolvedValue({ success: true, message: "OK" });

    render(<RegisterForm />);
    await fillForm({ instituteType: "public" });
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(mockHandleRegisterSchool).toHaveBeenCalledWith(
        expect.objectContaining({ instituteType: "PUBLIC" })
      );
    });
  });

  test("renders login and terms links", () => {
    render(<RegisterForm />);
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: /terms and conditions/i })).toHaveAttribute("href", "/terms");
  });
});