// src/__tests__/components/StudentFormModal.test.tsx

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import StudentFormModal from "@/app/school/dashboard/_components/StudentFormModal";

const mockCreateStudent = jest.fn();
const mockUpdateStudent = jest.fn();

jest.mock("@/lib/api/student-api", () => ({
  createStudent: (...args: any[]) => mockCreateStudent(...args),
  updateStudent: (...args: any[]) => mockUpdateStudent(...args),
}));


const user = userEvent.setup();

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

const defaultProps = {
  student: null,
  onClose: mockOnClose,
  onSave: mockOnSave,
};

const existingStudent = {
  _id: "student123",
  fullName: "Jane Doe",
  email: "jane@example.com",
  className: "10A",
  imageUrl: null,
};

const fillForm = async ({
  fullName = "John Smith",
  email = "john@example.com",
  password = "secret123",
  className = "9B",
} = {}) => {
  await user.clear(screen.getByPlaceholderText("Full Name"));
  await user.type(screen.getByPlaceholderText("Full Name"), fullName);

  await user.clear(screen.getByPlaceholderText("Email"));
  await user.type(screen.getByPlaceholderText("Email"), email);

  await user.clear(screen.getByPlaceholderText("Password"));
  if (password) await user.type(screen.getByPlaceholderText("Password"), password);

  await user.clear(screen.getByPlaceholderText("Class"));
  await user.type(screen.getByPlaceholderText("Class"), className);
};

beforeEach(() => {
  jest.clearAllMocks();
  mockCreateStudent.mockResolvedValue({ success: true });
  mockUpdateStudent.mockResolvedValue({ success: true });
});


describe("StudentFormModal", () => {

  test("renders Add Student title when no student prop is given", () => {
    render(<StudentFormModal {...defaultProps} />);
    expect(screen.getByText("Add Student")).toBeInTheDocument();
  });

  test("renders Edit Student title when a student is provided", () => {
    render(<StudentFormModal {...defaultProps} student={existingStudent} />);
    expect(screen.getByText("Edit Student")).toBeInTheDocument();
  });

  test("renders all form fields", () => {
    render(<StudentFormModal {...defaultProps} />);
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Class")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  test("renders file input for image upload", () => {
    render(<StudentFormModal {...defaultProps} />);
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute("accept", "image/*");
  });


  test("pre-fills fields with existing student data in edit mode", () => {
    render(<StudentFormModal {...defaultProps} student={existingStudent} />);
    expect(screen.getByPlaceholderText("Full Name")).toHaveValue(existingStudent.fullName);
    expect(screen.getByPlaceholderText("Email")).toHaveValue(existingStudent.email);
    expect(screen.getByPlaceholderText("Class")).toHaveValue(existingStudent.className);
  });

  test("does not pre-fill password in edit mode", () => {
    render(<StudentFormModal {...defaultProps} student={existingStudent} />);
    expect(screen.getByPlaceholderText("Password")).toHaveValue("");
  });

  test("does not show image preview when student has no imageUrl", () => {
    render(<StudentFormModal {...defaultProps} student={existingStudent} />);
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  test("shows image preview when student has an imageUrl", () => {
    const studentWithImage = { ...existingStudent, imageUrl: "/uploads/avatar.png" };
    render(<StudentFormModal {...defaultProps} student={studentWithImage} />);
    expect(document.querySelector("img")).toBeInTheDocument();
  });


  test("calls onClose when Cancel button is clicked", async () => {
    render(<StudentFormModal {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });


  test("calls createStudent with FormData on add-mode submit", async () => {
    render(<StudentFormModal {...defaultProps} />);
    await fillForm();
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockCreateStudent).toHaveBeenCalledTimes(1);
    });
    const fd: FormData = mockCreateStudent.mock.calls[0][0];
    expect(fd.get("fullName")).toBe("John Smith");
    expect(fd.get("email")).toBe("john@example.com");
    expect(fd.get("className")).toBe("9B");
    expect(fd.get("password")).toBe("secret123");
  });

  test("calls onSave after successful create", async () => {
    render(<StudentFormModal {...defaultProps} />);
    await fillForm();
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });

  test("does not call updateStudent when creating a new student", async () => {
    render(<StudentFormModal {...defaultProps} />);
    await fillForm();
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateStudent).not.toHaveBeenCalled();
    });
  });


  test("calls updateStudent with correct id and FormData on edit-mode submit", async () => {
    render(<StudentFormModal {...defaultProps} student={existingStudent} />);
    await user.clear(screen.getByPlaceholderText("Full Name"));
    await user.type(screen.getByPlaceholderText("Full Name"), "Jane Updated");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateStudent).toHaveBeenCalledTimes(1);
    });
    const [id, fd] = mockUpdateStudent.mock.calls[0];
    expect(id).toBe("student123");
    expect(fd.get("fullName")).toBe("Jane Updated");
  });

  test("calls onSave after successful update", async () => {
    render(<StudentFormModal {...defaultProps} student={existingStudent} />);
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });
  });

  test("does not call createStudent when editing an existing student", async () => {
    render(<StudentFormModal {...defaultProps} student={existingStudent} />);
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockCreateStudent).not.toHaveBeenCalled();
    });
  });

  test("does not append password to FormData when password field is empty", async () => {
    render(<StudentFormModal {...defaultProps} student={existingStudent} />);
    // password is left empty (pre-filled as "")
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateStudent).toHaveBeenCalledTimes(1);
    });
    const fd: FormData = mockUpdateStudent.mock.calls[0][1];
    expect(fd.get("password")).toBeNull();
  });

  test("appends password to FormData when a new password is entered in edit mode", async () => {
    render(<StudentFormModal {...defaultProps} student={existingStudent} />);
    await user.type(screen.getByPlaceholderText("Password"), "newpass456");
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateStudent).toHaveBeenCalledTimes(1);
    });
    const fd: FormData = mockUpdateStudent.mock.calls[0][1];
    expect(fd.get("password")).toBe("newpass456");
  });


  test("shows a preview and appends image to FormData when a file is selected", async () => {
    render(<StudentFormModal {...defaultProps} />);

    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    const fakeUrl = "blob:http://localhost/fake-url";
    global.URL.createObjectURL = jest.fn(() => fakeUrl);

    await user.upload(fileInput, file);

    const preview = document.querySelector("img");
    expect(preview).toBeInTheDocument();
    expect(preview).toHaveAttribute("src", fakeUrl);

    await fillForm();
    await user.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(mockCreateStudent).toHaveBeenCalledTimes(1);
    });
    const fd: FormData = mockCreateStudent.mock.calls[0][0];
    expect(fd.get("image")).toBe(file);
  });
});