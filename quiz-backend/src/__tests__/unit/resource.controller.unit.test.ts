jest.mock("../../services/resource.service", () => ({
  ResourceService: jest.fn().mockImplementation(() => ({
    createResource: jest.fn(),
    getSchoolResources: jest.fn(),
    getResourcesForStudent: jest.fn(),
    getResourceById: jest.fn(),
    updateResource: jest.fn(),
    deleteResource: jest.fn(),
  })),
}));

jest.mock("../../services/auth.services");
jest.mock("../../services/student.service", () => ({
  StudentService: {
    uploadProfilePicture: jest.fn(),
    getById: jest.fn(),
  },
}));

jest.mock("../../models/quizResult.model");
jest.mock("../../models/resource.model");
jest.mock("../../dtos/resource.dto", () => ({
  createResourceDto: { parse: jest.fn() },
  updateResourceDto: { parse: jest.fn() },
}));

import { ResourceService } from "../../services/resource.service";
import { AuthService } from "../../services/auth.services";
import { StudentService } from "../../services/student.service";
import { QuizResultModel } from "../../models/quizResult.model";
import { ResourceModel } from "../../models/resource.model";
import { createResourceDto, updateResourceDto } from "../../dtos/resource.dto";

import {
  createResource,
  getSchoolResources,
  getStudentResources,
  updateResource,
  deleteResource,
} from "../../controllers/resource.controller";

import {
  registerSchool,
  login,
  studentLogin,
  changePassword,
  forgotPassword,
  resetPassword,
  forgotStudentPassword,
  resetStudentPassword,
} from "../../controllers/auth.controller";

import {
  uploadStudentProfilePicture,
  getStudentProfile,
} from "../../controllers/student.controller";

import { QuizResultRepository } from "../../repositories/quizresult.repository";
import { ResourceRepository } from "../../repositories/resource.repository";

const resourceServiceInstance = (ResourceService as jest.Mock).mock.results[0].value;
const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
const mockStudentService = StudentService as jest.Mocked<typeof StudentService>;

const makeReq = (overrides = {}): any => ({
  user: { id: "school1" },
  params: {},
  body: {},
  file: undefined,
  ...overrides,
});

const makeRes = (): any => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

beforeEach(() => jest.clearAllMocks());

describe("createResource controller", () => {
  test("creates PDF resource successfully", async () => {
    (createResourceDto.parse as jest.Mock).mockReturnValue({ format: "PDF", title: "Doc" });
    resourceServiceInstance.createResource.mockResolvedValue({ _id: "r1" });
    const res = makeRes();

    await createResource(
      makeReq({ file: { filename: "test.pdf" }, body: {} }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test("returns 400 when PDF format but no file", async () => {
    (createResourceDto.parse as jest.Mock).mockReturnValue({ format: "PDF" });
    const res = makeRes();

    await createResource(makeReq({ file: undefined, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "PDF file required" });
  });

  test("creates LINK resource successfully", async () => {
    (createResourceDto.parse as jest.Mock).mockReturnValue({
      format: "LINK",
      linkUrl: "https://example.com",
    });
    resourceServiceInstance.createResource.mockResolvedValue({ _id: "r1" });
    const res = makeRes();

    await createResource(makeReq({ body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("returns 400 when LINK format but no linkUrl", async () => {
    (createResourceDto.parse as jest.Mock).mockReturnValue({ format: "LINK", linkUrl: undefined });
    const res = makeRes();

    await createResource(makeReq({ body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Link URL required" });
  });

  test("returns 400 on service error", async () => {
    (createResourceDto.parse as jest.Mock).mockReturnValue({ format: "LINK", linkUrl: "https://x.com" });
    resourceServiceInstance.createResource.mockRejectedValue(new Error("DB error"));
    const res = makeRes();

    await createResource(makeReq({ body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("getSchoolResources controller", () => {
  test("returns resources for school", async () => {
    resourceServiceInstance.getSchoolResources.mockResolvedValue([{ _id: "r1" }]);
    const res = makeRes();

    await getSchoolResources(makeReq(), res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ _id: "r1" }] });
  });
});

describe("getStudentResources controller", () => {
  test("returns resources for student", async () => {
    resourceServiceInstance.getResourcesForStudent.mockResolvedValue([{ _id: "r1" }]);
    const res = makeRes();

    await getStudentResources(makeReq(), res);

    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ _id: "r1" }] });
  });

  test("returns 400 on error", async () => {
    resourceServiceInstance.getResourcesForStudent.mockRejectedValue(new Error("not found"));
    const res = makeRes();

    await getStudentResources(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("updateResource controller", () => {
  test("updates resource successfully", async () => {
    resourceServiceInstance.getResourceById.mockResolvedValue({
      _id: "r1",
      schoolId: { toString: () => "school1" },
    });
    (updateResourceDto.parse as jest.Mock).mockReturnValue({ title: "Updated" });
    resourceServiceInstance.updateResource.mockResolvedValue({ _id: "r1", title: "Updated" });
    const res = makeRes();

    await updateResource(makeReq({ params: { id: "r1" }, body: {} }), res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
  });

  test("returns 404 when resource not found", async () => {
    resourceServiceInstance.getResourceById.mockResolvedValue(null);
    const res = makeRes();

    await updateResource(makeReq({ params: { id: "r1" }, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("returns 403 when school does not own resource", async () => {
    resourceServiceInstance.getResourceById.mockResolvedValue({
      _id: "r1",
      schoolId: { toString: () => "otherSchool" },
    });
    const res = makeRes();

    await updateResource(makeReq({ params: { id: "r1" }, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("sets newFilePath when file is uploaded", async () => {
    resourceServiceInstance.getResourceById.mockResolvedValue({
      _id: "r1",
      schoolId: { toString: () => "school1" },
    });
    (updateResourceDto.parse as jest.Mock).mockReturnValue({});
    resourceServiceInstance.updateResource.mockResolvedValue({ _id: "r1" });
    const res = makeRes();

    await updateResource(
      makeReq({ params: { id: "r1" }, body: {}, file: { filename: "new.pdf" } }),
      res
    );

    expect(resourceServiceInstance.updateResource).toHaveBeenCalledWith(
      "r1",
      expect.anything(),
      expect.stringContaining("new.pdf")
    );
  });
});

describe("deleteResource controller", () => {
  test("deletes resource successfully", async () => {
    resourceServiceInstance.getResourceById.mockResolvedValue({
      _id: "r1",
      schoolId: { toString: () => "school1" },
    });
    resourceServiceInstance.deleteResource.mockResolvedValue(undefined);
    const res = makeRes();

    await deleteResource(makeReq({ params: { id: "r1" } }), res);

    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Resource deleted" });
  });

  test("returns 404 when resource not found", async () => {
    resourceServiceInstance.getResourceById.mockResolvedValue(null);
    const res = makeRes();

    await deleteResource(makeReq({ params: { id: "r1" } }), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("returns 403 when school does not own resource", async () => {
    resourceServiceInstance.getResourceById.mockResolvedValue({
      _id: "r1",
      schoolId: { toString: () => "otherSchool" },
    });
    const res = makeRes();

    await deleteResource(makeReq({ params: { id: "r1" } }), res);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe("registerSchool controller", () => {
  test("returns 201 on successful registration", async () => {
    mockAuthService.registerSchool.mockResolvedValue({} as any);
    const res = makeRes();

    await registerSchool(
      makeReq({
        body: {
          name: "Test School",
          email: "school@test.com",
          password: "Password1",
          pan: "123456789",
          contactNumber: "9876543210",
          instituteType: "PRIVATE",
          location: { city: "KTM", district: "Bagmati" },
        },
      }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("returns 400 on registration error", async () => {
    mockAuthService.registerSchool.mockRejectedValue(new Error("Email exists"));
    const res = makeRes();

    await registerSchool(makeReq({ body: { name: "x", email: "x@x.com", password: "Password1", pan: "123456789", contactNumber: "9876543210", instituteType: "PRIVATE", location: { city: "KTM", district: "Bagmati" } } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("login controller", () => {
  test("returns token on successful login", async () => {
    mockAuthService.login.mockResolvedValue({ token: "tok123", role: "SCHOOL" });
    const res = makeRes();

    await login(makeReq({ body: { email: "school@test.com", password: "Password1" } }), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, token: "tok123" })
    );
  });

  test("returns 401 on invalid credentials", async () => {
    mockAuthService.login.mockRejectedValue(new Error("Invalid credentials"));
    const res = makeRes();

    await login(makeReq({ body: { email: "x@x.com", password: "wrongpass" } }), res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("studentLogin controller", () => {
  test("returns student data and token on success", async () => {
    mockAuthService.loginStudent.mockResolvedValue({
      token: "stok",
      role: "STUDENT",
      email: "s@s.com",
      fullName: "Test",
      className: 10,
      isFirstLogin: false,
      studentId: "507f1f77bcf86cd799439011",
    } as any);
    const res = makeRes();

    await studentLogin(makeReq({ body: { email: "s@s.com", password: "Password1" } }), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, token: "stok" })
    );
  });

  test("returns 401 on invalid credentials", async () => {
    mockAuthService.loginStudent.mockRejectedValue(new Error("Invalid credentials"));
    const res = makeRes();

    await studentLogin(makeReq({ body: { email: "x@x.com", password: "wrong" } }), res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe("changePassword controller", () => {
  test("changes password successfully", async () => {
    mockAuthService.changeStudentPassword.mockResolvedValue(undefined);
    const res = makeRes();

    await changePassword(
      makeReq({ body: { newPassword: "NewPass123" } }),
      res
    );

    expect(res.json).toHaveBeenCalledWith({ message: "Password changed successfully" });
  });

  test("returns 400 on error", async () => {
    mockAuthService.changeStudentPassword.mockRejectedValue(new Error("fail"));
    const res = makeRes();

    await changePassword(makeReq({ body: { newPassword: "NewPass123" } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("forgotPassword controller", () => {
  test("returns success message", async () => {
    mockAuthService.forgotPassword.mockResolvedValue(undefined);
    const res = makeRes();

    await forgotPassword(makeReq({ body: { email: "school@test.com" } }), res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("reset link") })
    );
  });

  test("returns 400 when email is missing", async () => {
    mockAuthService.forgotPassword.mockResolvedValue(undefined);
    const res = makeRes();

    await forgotPassword(makeReq({ body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("resetPassword controller", () => {
  test("resets password successfully", async () => {
    mockAuthService.resetPassword.mockResolvedValue(undefined);
    const res = makeRes();

    await resetPassword(
      makeReq({ body: { token: "tok", newPassword: "NewPass123" } }),
      res
    );

    expect(res.json).toHaveBeenCalledWith({ message: "Password reset successful" });
  });

  test("returns 400 on invalid token", async () => {
    mockAuthService.resetPassword.mockRejectedValue(new Error("Invalid token"));
    const res = makeRes();

    await resetPassword(makeReq({ body: { token: "bad", newPassword: "NewPass123" } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("forgotStudentPassword controller", () => {
  test("returns OTP sent message", async () => {
    mockAuthService.forgotStudentPassword.mockResolvedValue(undefined);
    const res = makeRes();

    await forgotStudentPassword(makeReq({ body: { email: "s@s.com" } }), res);

    expect(res.json).toHaveBeenCalledWith({ message: "OTP sent if email exists" });
  });

  test("returns 400 on error", async () => {
    mockAuthService.forgotStudentPassword.mockRejectedValue(new Error("fail"));
    const res = makeRes();

    await forgotStudentPassword(makeReq({ body: { email: "s@s.com" } }), res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("resetStudentPassword controller", () => {
  test("resets student password successfully", async () => {
    mockAuthService.resetStudentPassword.mockResolvedValue(undefined);
    const res = makeRes();

    await resetStudentPassword(
      makeReq({ body: { email: "s@s.com", otp: "123456", newPassword: "NewPass123" } }),
      res
    );

    expect(res.json).toHaveBeenCalledWith({ message: "Password reset successful" });
  });

  test("returns 400 on invalid OTP", async () => {
    mockAuthService.resetStudentPassword.mockRejectedValue(new Error("Invalid OTP"));
    const res = makeRes();

    await resetStudentPassword(
      makeReq({ body: { email: "s@s.com", otp: "bad", newPassword: "NewPass123" } }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("uploadStudentProfilePicture controller", () => {
  test("uploads profile picture successfully", async () => {
    mockStudentService.uploadProfilePicture.mockResolvedValue({
      _id: "stu1",
      imageUrl: "/uploads/photo.jpg",
      isFirstLogin: false,
    } as any);
    const res = makeRes();

    await uploadStudentProfilePicture(
      makeReq({ file: { filename: "photo.jpg" }, body: {} }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("returns 400 when no file provided", async () => {
    const res = makeRes();

    await uploadStudentProfilePicture(makeReq({ file: undefined, body: {} }), res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Profile picture is required" });
  });

  test("returns 400 on service error", async () => {
    mockStudentService.uploadProfilePicture.mockRejectedValue(new Error("Student not found"));
    const res = makeRes();

    await uploadStudentProfilePicture(
      makeReq({ file: { filename: "photo.jpg" }, body: {} }),
      res
    );

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("getStudentProfile controller", () => {
  test("returns student profile on success", async () => {
    mockStudentService.getById.mockResolvedValue({
      fullName: "Test Student",
      email: "s@s.com",
      className: 10,
      imageUrl: "/img.jpg",
      isFirstLogin: false,
    } as any);
    const res = makeRes();

    await getStudentProfile(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("returns 404 when student not found", async () => {
    mockStudentService.getById.mockResolvedValue(null);
    const res = makeRes();

    await getStudentProfile(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("returns 500 on unexpected error", async () => {
    mockStudentService.getById.mockRejectedValue(new Error("DB error"));
    const res = makeRes();

    await getStudentProfile(makeReq(), res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("QuizResultRepository", () => {
  let repo: QuizResultRepository;

  beforeEach(() => {
    repo = new QuizResultRepository();
  });

  test("findByStudentAndQuiz calls findOne with correct args", async () => {
    (QuizResultModel.findOne as jest.Mock).mockResolvedValue({ _id: "r1" });

    const result = await repo.findByStudentAndQuiz("stu1", "quiz1");

    expect(QuizResultModel.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ _id: "r1" });
  });

  test("findByQuiz populates studentId", async () => {
    const populateMock = jest.fn().mockResolvedValue([{ _id: "r1" }]);
    (QuizResultModel.find as jest.Mock).mockReturnValue({ populate: populateMock });

    const result = await repo.findByQuiz("quiz1");

    expect(QuizResultModel.find).toHaveBeenCalledWith({ quizId: "quiz1" });
    expect(populateMock).toHaveBeenCalledWith("studentId", "fullName email className");
    expect(result).toHaveLength(1);
  });


  test("findByQuizIds queries with $in and populates both", async () => {
    const sortMock = jest.fn().mockResolvedValue([{ _id: "r1" }]);
    const populate2Mock = jest.fn().mockReturnValue({ sort: sortMock });
    const populate1Mock = jest.fn().mockReturnValue({ populate: populate2Mock });
    (QuizResultModel.find as jest.Mock).mockReturnValue({ populate: populate1Mock });

    const result = await repo.findByQuizIds(["quiz1", "quiz2"]);

    expect(QuizResultModel.find).toHaveBeenCalledWith({
      quizId: { $in: ["quiz1", "quiz2"] },
    });
    expect(result).toHaveLength(1);
  });
});


describe("ResourceRepository", () => {
  let repo: ResourceRepository;

  beforeEach(() => {
    repo = new ResourceRepository();
  });

  test("create calls ResourceModel.create", async () => {
    (ResourceModel.create as jest.Mock).mockResolvedValue({ _id: "r1" });

    const result = await repo.create({ title: "Doc" });

    expect(ResourceModel.create).toHaveBeenCalledWith({ title: "Doc" });
    expect(result).toEqual({ _id: "r1" });
  });

  test("findBySchool queries by schoolId and sorts", async () => {
    const sortMock = jest.fn().mockResolvedValue([{ _id: "r1" }]);
    (ResourceModel.find as jest.Mock).mockReturnValue({ sort: sortMock });

    const result = await repo.findBySchool("school1");

    expect(ResourceModel.find).toHaveBeenCalledWith({ schoolId: "school1" });
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(result).toHaveLength(1);
  });

  test("findAll returns all resources sorted", async () => {
    const sortMock = jest.fn().mockResolvedValue([{ _id: "r1" }, { _id: "r2" }]);
    (ResourceModel.find as jest.Mock).mockReturnValue({ sort: sortMock });

    const result = await repo.findAll();

    expect(ResourceModel.find).toHaveBeenCalledWith();
    expect(result).toHaveLength(2);
  });

  test("findById calls findById with correct id", async () => {
    (ResourceModel.findById as jest.Mock).mockResolvedValue({ _id: "r1" });

    const result = await repo.findById("r1");

    expect(ResourceModel.findById).toHaveBeenCalledWith("r1");
    expect(result).toEqual({ _id: "r1" });
  });

  test("update calls findByIdAndUpdate with new:true", async () => {
    (ResourceModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: "r1", title: "New" });

    const result = await repo.update("r1", { title: "New" });

    expect(ResourceModel.findByIdAndUpdate).toHaveBeenCalledWith(
      "r1",
      { title: "New" },
      { new: true }
    );
    expect(result).toEqual({ _id: "r1", title: "New" });
  });

  test("delete calls findByIdAndDelete", async () => {
    (ResourceModel.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: "r1" });

    await repo.delete("r1");

    expect(ResourceModel.findByIdAndDelete).toHaveBeenCalledWith("r1");
  });
});