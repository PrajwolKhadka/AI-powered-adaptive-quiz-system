// src/__tests__/unit/services/auth.service.test.ts

import { AuthService } from "../../services/auth.services";

// ── Mock all dependencies ─────────────────────────────────────────────────────
jest.mock("../../repositories/school.repository");
jest.mock("../../repositories/student.repository");
jest.mock("../../models/student.model");
jest.mock("../../utils/mailer");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("crypto");

import { SchoolRepository } from "../../repositories/school.repository";
import { StudentRepository } from "../../repositories/student.repository";
import { Student } from "../../models/student.model";
import { sendEmail } from "../../utils/mailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const mockSchoolRepo = SchoolRepository as jest.Mocked<typeof SchoolRepository>;
const mockStudentRepo = StudentRepository as jest.Mocked<typeof StudentRepository>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

const makeSchool = (overrides = {}): any => ({
  id: "school123",
  email: "school@example.com",
  password: "hashed_password",
  role: "SCHOOL",
  ...overrides,
});

const makeStudent = (overrides = {}): any => ({
  _id: "student123",
  email: "student@example.com",
  password: "hashed_password",
  fullName: "Test Student",
  className: 10,
  isFirstLogin: true,
  role: "STUDENT",
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_SECRET = "test_secret";
  process.env.FRONTEND_URL = "http://localhost:3000";
});

describe("AuthService.registerSchool", () => {
  const data = {
    name: "Test School",
    email: "new@school.com",
    password: "plainPassword",
    pan: "123456789",
    contactNumber: "9876543210",
    instituteType: "PRIVATE",
    location: { city: "Kathmandu", district: "Bagmati" },
  };

  test("registers a new school successfully", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(null);
    mockSchoolRepo.findByPan.mockResolvedValue(null);
    mockSchoolRepo.findByContactNumber.mockResolvedValue(null);
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");
    mockSchoolRepo.create.mockResolvedValue(makeSchool());

    const result = await AuthService.registerSchool(data);

    expect(mockSchoolRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: "hashed_password" })
    );
    expect(result).toBeDefined();
  });

  test("hashes the password before saving", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(null);
    mockSchoolRepo.findByPan.mockResolvedValue(null);
    mockSchoolRepo.findByContactNumber.mockResolvedValue(null);
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed_pw");
    mockSchoolRepo.create.mockResolvedValue(makeSchool());

    await AuthService.registerSchool(data);

    expect(mockBcrypt.hash).toHaveBeenCalledWith("plainPassword", 10);
  });

  test("throws if email already exists", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(makeSchool());
    mockSchoolRepo.findByPan.mockResolvedValue(null);
    mockSchoolRepo.findByContactNumber.mockResolvedValue(null);

    await expect(AuthService.registerSchool(data)).rejects.toThrow(
      "School with this email already exists"
    );
  });

  test("throws if PAN already exists", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(null);
    mockSchoolRepo.findByPan.mockResolvedValue(makeSchool());
    mockSchoolRepo.findByContactNumber.mockResolvedValue(null);

    await expect(AuthService.registerSchool(data)).rejects.toThrow(
      "School with this PAN already exists"
    );
  });

  test("throws if contact number already exists", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(null);
    mockSchoolRepo.findByPan.mockResolvedValue(null);
    mockSchoolRepo.findByContactNumber.mockResolvedValue(makeSchool());

    await expect(AuthService.registerSchool(data)).rejects.toThrow(
      "School with this contact number already exists"
    );
  });

  test("checks email, pan, and contact number in parallel", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(null);
    mockSchoolRepo.findByPan.mockResolvedValue(null);
    mockSchoolRepo.findByContactNumber.mockResolvedValue(null);
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed");
    mockSchoolRepo.create.mockResolvedValue(makeSchool());

    await AuthService.registerSchool(data);

    expect(mockSchoolRepo.findByEmail).toHaveBeenCalledWith(data.email);
    expect(mockSchoolRepo.findByPan).toHaveBeenCalledWith(data.pan);
    expect(mockSchoolRepo.findByContactNumber).toHaveBeenCalledWith(data.contactNumber);
  });
});

// login (school)

describe("AuthService.login", () => {
  test("returns token and role on valid credentials", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(makeSchool());
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
    (mockJwt.sign as jest.Mock).mockReturnValue("mock_token");

    const result = await AuthService.login("school@example.com", "password");

    expect(result.token).toBe("mock_token");
    expect(result.role).toBe("SCHOOL");
  });

  test("throws 'Invalid credentials' when school not found", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(null);

    await expect(
      AuthService.login("ghost@example.com", "password")
    ).rejects.toThrow("Invalid credentials");
  });

  test("throws 'Invalid credentials' when password does not match", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(makeSchool());
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      AuthService.login("school@example.com", "wrongpassword")
    ).rejects.toThrow("Invalid credentials");
  });

  test("signs JWT with correct role and expiry", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(makeSchool({ id: "abc" }));
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
    (mockJwt.sign as jest.Mock).mockReturnValue("tok");

    await AuthService.login("school@example.com", "password");

    expect(mockJwt.sign).toHaveBeenCalledWith(
      { id: "abc", role: "SCHOOL" },
      "test_secret",
      { expiresIn: "30d" }
    );
  });
});

// loginStudent

describe("AuthService.loginStudent", () => {
  test("returns full student data and token on valid credentials", async () => {
    mockStudentRepo.findByEmail.mockResolvedValue(makeStudent());
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
    (mockJwt.sign as jest.Mock).mockReturnValue("student_token");

    const result = await AuthService.loginStudent("student@example.com", "password");

    expect(result.token).toBe("student_token");
    expect(result.fullName).toBe("Test Student");
    expect(result.email).toBe("student@example.com");
    expect(result.className).toBe(10);
    expect(result.isFirstLogin).toBe(true);
    expect(result.role).toBe("STUDENT");
  });

  test("throws 'Invalid credentials' when student not found", async () => {
    mockStudentRepo.findByEmail.mockResolvedValue(null);

    await expect(
      AuthService.loginStudent("ghost@example.com", "password")
    ).rejects.toThrow("Invalid credentials");
  });

  test("throws 'Invalid credentials' when password does not match", async () => {
    mockStudentRepo.findByEmail.mockResolvedValue(makeStudent());
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      AuthService.loginStudent("student@example.com", "wrong")
    ).rejects.toThrow("Invalid credentials");
  });

  test("signs JWT with STUDENT role", async () => {
    mockStudentRepo.findByEmail.mockResolvedValue(makeStudent({ _id: "stu42" }));
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
    (mockJwt.sign as jest.Mock).mockReturnValue("tok");

    await AuthService.loginStudent("student@example.com", "password");

    expect(mockJwt.sign).toHaveBeenCalledWith(
      { id: "stu42", role: "STUDENT" },
      "test_secret",
      { expiresIn: "30d" }
    );
  });
});

// changeStudentPassword

describe("AuthService.changeStudentPassword", () => {
  test("hashes the new password and calls updatePassword", async () => {
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("new_hashed");
    mockStudentRepo.updatePassword = jest.fn().mockResolvedValue({});

    await AuthService.changeStudentPassword("student123", "newPassword");

    expect(mockBcrypt.hash).toHaveBeenCalledWith("newPassword", 10);
    expect(mockStudentRepo.updatePassword).toHaveBeenCalledWith(
      "student123",
      "new_hashed"
    );
  });

  test("does not store plain text password", async () => {
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed_new");
    mockStudentRepo.updatePassword = jest.fn().mockResolvedValue({});

    await AuthService.changeStudentPassword("student123", "plainText");

    expect(mockStudentRepo.updatePassword).not.toHaveBeenCalledWith(
      expect.anything(),
      "plainText"
    );
  });
});

// forgotPassword (school)
describe("AuthService.forgotPassword", () => {
  beforeEach(() => {
    // Mock crypto to return predictable values
    const mockCrypto = crypto as jest.Mocked<typeof crypto>;
    (mockCrypto.randomBytes as jest.Mock).mockReturnValue({
      toString: () => "random_token_hex",
    });
    (mockCrypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("hashed_token"),
    });
  });

  test("silently returns (no throw) when email does not exist", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(null);

    await expect(
      AuthService.forgotPassword("ghost@example.com")
    ).resolves.toBeUndefined();

    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  test("saves hashed reset token and expiry when email exists", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(makeSchool({ id: "s1" }));
    mockSchoolRepo.updateById = jest.fn().mockResolvedValue({});
    mockSendEmail.mockResolvedValue(undefined);

    await AuthService.forgotPassword("school@example.com");

    expect(mockSchoolRepo.updateById).toHaveBeenCalledWith(
      "s1",
      expect.objectContaining({
        resetPasswordToken: "hashed_token",
        resetPasswordExpiry: expect.any(Date),
      })
    );
  });

  test("sends reset email when school is found", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(makeSchool({ email: "school@example.com" }));
    mockSchoolRepo.updateById = jest.fn().mockResolvedValue({});
    mockSendEmail.mockResolvedValue(undefined);

    await AuthService.forgotPassword("school@example.com");

    expect(mockSendEmail).toHaveBeenCalledWith(
      "school@example.com",
      "Reset Your Password",
      expect.stringContaining("reset")
    );
  });

  test("does not send email when school is not found", async () => {
    mockSchoolRepo.findByEmail.mockResolvedValue(null);

    await AuthService.forgotPassword("nobody@example.com");

    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});

// resetPassword (school)
describe("AuthService.resetPassword", () => {
  beforeEach(() => {
    const mockCrypto = crypto as jest.Mocked<typeof crypto>;
    (mockCrypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("hashed_token"),
    });
  });

  test("resets password successfully with valid token", async () => {
    mockSchoolRepo.findByResetToken = jest.fn().mockResolvedValue(makeSchool({ id: "s1" }));
    mockSchoolRepo.updateById = jest.fn().mockResolvedValue({});
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("new_hashed_pw");

    await AuthService.resetPassword("valid_token", "newPassword123");

    expect(mockSchoolRepo.updateById).toHaveBeenCalledWith(
      "s1",
      expect.objectContaining({ password: "new_hashed_pw" })
    );
  });

  test("throws 'Invalid or expired token' when token not found", async () => {
    mockSchoolRepo.findByResetToken = jest.fn().mockResolvedValue(null);

    await expect(
      AuthService.resetPassword("bad_token", "newPassword")
    ).rejects.toThrow("Invalid or expired token");
  });

  test("clears resetPasswordToken and resetPasswordExpiry after reset", async () => {
    mockSchoolRepo.findByResetToken = jest.fn().mockResolvedValue(makeSchool({ id: "s1" }));
    mockSchoolRepo.updateById = jest.fn().mockResolvedValue({});
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed");

    await AuthService.resetPassword("valid_token", "newPassword");

    expect(mockSchoolRepo.updateById).toHaveBeenCalledWith(
      "s1",
      expect.objectContaining({
        resetPasswordToken: undefined,
        resetPasswordExpiry: undefined,
      })
    );
  });

  test("hashes the new password before saving", async () => {
    mockSchoolRepo.findByResetToken = jest.fn().mockResolvedValue(makeSchool({ id: "s1" }));
    mockSchoolRepo.updateById = jest.fn().mockResolvedValue({});
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed");

    await AuthService.resetPassword("valid_token", "MyNewPass123");

    expect(mockBcrypt.hash).toHaveBeenCalledWith("MyNewPass123", 10);
  });
});

// forgotStudentPassword
describe("AuthService.forgotStudentPassword", () => {
  test("silently returns when student email not found", async () => {
    mockStudentRepo.findByEmail.mockResolvedValue(null);

    await expect(
      AuthService.forgotStudentPassword("ghost@example.com")
    ).resolves.toBeUndefined();

    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  test("sends OTP email when student is found", async () => {
    mockStudentRepo.findByEmail.mockResolvedValue(makeStudent());
    (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    mockSendEmail.mockResolvedValue(undefined);

    const mockCrypto = crypto as jest.Mocked<typeof crypto>;
    (mockCrypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("hashed_otp"),
    });

    await AuthService.forgotStudentPassword("student@example.com");

    expect(mockSendEmail).toHaveBeenCalledWith(
      "student@example.com",
      "Reset Your Password - OTP",
      expect.stringContaining("OTP")
    );
  });

  test("saves hashed OTP and expiry in student document", async () => {
    mockStudentRepo.findByEmail.mockResolvedValue(makeStudent({ _id: "stu1" }));
    (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    mockSendEmail.mockResolvedValue(undefined);

    const mockCrypto = crypto as jest.Mocked<typeof crypto>;
    (mockCrypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("hashed_otp"),
    });

    await AuthService.forgotStudentPassword("student@example.com");

    expect(Student.findByIdAndUpdate).toHaveBeenCalledWith(
      "stu1",
      expect.objectContaining({
        resetPasswordOtp: "hashed_otp",
        resetPasswordExpiry: expect.any(Date),
      })
    );
  });
});

// resetStudentPassword
describe("AuthService.resetStudentPassword", () => {
  beforeEach(() => {
    const mockCrypto = crypto as jest.Mocked<typeof crypto>;
    (mockCrypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("hashed_otp"),
    });
  });

  test("resets password when OTP is valid and not expired", async () => {
    const mockStudent = makeStudent({ _id: "stu1" });
    (Student.findOne as jest.Mock).mockResolvedValue(mockStudent);
    (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("new_hashed_pw");

    await AuthService.resetStudentPassword(
      "student@example.com",
      "123456",
      "newPassword123"
    );

    expect(Student.findByIdAndUpdate).toHaveBeenCalledWith(
      "stu1",
      expect.objectContaining({ password: "new_hashed_pw" })
    );
  });

  test("throws 'Invalid or expired OTP' when student not found with OTP", async () => {
    (Student.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      AuthService.resetStudentPassword("student@example.com", "wrong_otp", "newPass")
    ).rejects.toThrow("Invalid or expired OTP");
  });

  test("clears OTP fields after successful reset", async () => {
    (Student.findOne as jest.Mock).mockResolvedValue(makeStudent({ _id: "stu1" }));
    (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed");

    await AuthService.resetStudentPassword("student@example.com", "123456", "newPass");

    expect(Student.findByIdAndUpdate).toHaveBeenCalledWith(
      "stu1",
      expect.objectContaining({
        resetPasswordOtp: undefined,
        resetPasswordExpiry: undefined,
      })
    );
  });

  test("hashes the new password before saving", async () => {
    (Student.findOne as jest.Mock).mockResolvedValue(makeStudent({ _id: "stu1" }));
    (Student.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashed");

    await AuthService.resetStudentPassword("student@example.com", "123456", "MyNewPass");

    expect(mockBcrypt.hash).toHaveBeenCalledWith("MyNewPass", 10);
  });
});