import { ResourceService } from "../../services/resource.service";

jest.mock("../../repositories/resource.repository");
jest.mock("../../repositories/student.repository");
jest.mock("fs");

import { ResourceRepository } from "../../repositories/resource.repository";
import { StudentRepository } from "../../repositories/student.repository";
import { unlinkSync } from "fs";

const mockResourceRepo = {
  create: jest.fn(),
  findBySchool: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockStudentRepo = StudentRepository as jest.Mocked<typeof StudentRepository>;

(ResourceRepository as jest.Mock).mockImplementation(() => mockResourceRepo);

const mockUnlinkSync = unlinkSync as jest.MockedFunction<typeof unlinkSync>;

const makeResource = (overrides = {}): any => ({
  _id: "resource1",
  title: "Test Resource",
  format: "PDF",
  fileUrl: "/uploads/pdf/test.pdf",
  schoolId: { toString: () => "school1" },
  ...overrides,
});

const makeStudent = (overrides = {}): any => ({
  _id: "student1",
  schoolId: { toString: () => "school1" },
  ...overrides,
});

let service: ResourceService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new ResourceService();
});


describe("ResourceService.createResource", () => {
  test("calls repository create with provided data", async () => {
    mockResourceRepo.create.mockResolvedValue(makeResource());

    const data = { title: "Lesson 1", format: "PDF", fileUrl: "/uploads/pdf/a.pdf", schoolId: "school1" };
    const result = await service.createResource(data);

    expect(mockResourceRepo.create).toHaveBeenCalledWith(data);
    expect(result).toBeDefined();
  });

  test("returns the created resource", async () => {
    const resource = makeResource();
    mockResourceRepo.create.mockResolvedValue(resource);

    const result = await service.createResource({});

    expect(result).toEqual(resource);
  });
});


describe("ResourceService.getSchoolResources", () => {
  test("returns resources for a school", async () => {
    mockResourceRepo.findBySchool.mockResolvedValue([makeResource()]);

    const result = await service.getSchoolResources("school1");

    expect(mockResourceRepo.findBySchool).toHaveBeenCalledWith("school1");
    expect(result).toHaveLength(1);
  });

  test("returns empty array when school has no resources", async () => {
    mockResourceRepo.findBySchool.mockResolvedValue([]);

    const result = await service.getSchoolResources("school1");

    expect(result).toEqual([]);
  });
});


describe("ResourceService.getAllResources", () => {
  test("returns all resources", async () => {
    mockResourceRepo.findAll.mockResolvedValue([makeResource(), makeResource()]);

    const result = await service.getAllResources();

    expect(mockResourceRepo.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });
});


describe("ResourceService.getResourceById", () => {
  test("returns resource by id", async () => {
    mockResourceRepo.findById.mockResolvedValue(makeResource());

    const result = await service.getResourceById("resource1");

    expect(mockResourceRepo.findById).toHaveBeenCalledWith("resource1");
    expect(result).toBeDefined();
  });

  test("returns null when resource not found", async () => {
    mockResourceRepo.findById.mockResolvedValue(null);

    const result = await service.getResourceById("notExist");

    expect(result).toBeNull();
  });
});

describe("ResourceService.updateResource", () => {
  test("updates resource when it exists", async () => {
    mockResourceRepo.findById.mockResolvedValue(makeResource());
    mockResourceRepo.update.mockResolvedValue(makeResource({ title: "Updated" }));

    const result = await service.updateResource("resource1", { title: "Updated" });

    expect(mockResourceRepo.update).toHaveBeenCalledWith("resource1", expect.objectContaining({ title: "Updated" }));
    expect(result).toBeDefined();
  });

  test("throws 'Resource not found' when resource does not exist", async () => {
    mockResourceRepo.findById.mockResolvedValue(null);

    await expect(service.updateResource("bad", { title: "x" })).rejects.toThrow(
      "Resource not found"
    );
  });

  test("deletes old file and sets new fileUrl when newFilePath provided", async () => {
    mockResourceRepo.findById.mockResolvedValue(makeResource({ fileUrl: "/uploads/pdf/old.pdf" }));
    mockResourceRepo.update.mockResolvedValue(makeResource());
    mockUnlinkSync.mockImplementation(() => {});

    await service.updateResource("resource1", {}, "/uploads/pdf/new.pdf");

    expect(mockUnlinkSync).toHaveBeenCalled();
    expect(mockResourceRepo.update).toHaveBeenCalledWith(
      "resource1",
      expect.objectContaining({ fileUrl: "/uploads/pdf/new.pdf", format: "PDF" })
    );
  });

  test("does not call unlinkSync when no newFilePath provided", async () => {
    mockResourceRepo.findById.mockResolvedValue(makeResource());
    mockResourceRepo.update.mockResolvedValue(makeResource());

    await service.updateResource("resource1", { title: "New Title" });

    expect(mockUnlinkSync).not.toHaveBeenCalled();
  });

  test("still updates even if old file deletion fails", async () => {
    mockResourceRepo.findById.mockResolvedValue(makeResource({ fileUrl: "/uploads/pdf/old.pdf" }));
    mockResourceRepo.update.mockResolvedValue(makeResource());
    mockUnlinkSync.mockImplementation(() => { throw new Error("File not found"); });

    await expect(
      service.updateResource("resource1", {}, "/uploads/pdf/new.pdf")
    ).resolves.toBeDefined();
  });
});


describe("ResourceService.deleteResource", () => {
  test("deletes resource and removes file", async () => {
    mockResourceRepo.findById.mockResolvedValue(makeResource());
    mockResourceRepo.delete.mockResolvedValue(undefined);
    mockUnlinkSync.mockImplementation(() => {});

    await service.deleteResource("resource1");

    expect(mockUnlinkSync).toHaveBeenCalled();
    expect(mockResourceRepo.delete).toHaveBeenCalledWith("resource1");
  });

  test("still calls delete even if file removal fails", async () => {
    mockResourceRepo.findById.mockResolvedValue(makeResource());
    mockResourceRepo.delete.mockResolvedValue(undefined);
    mockUnlinkSync.mockImplementation(() => { throw new Error("no file"); });

    await service.deleteResource("resource1");

    expect(mockResourceRepo.delete).toHaveBeenCalledWith("resource1");
  });

  test("calls delete even when resource has no fileUrl", async () => {
    mockResourceRepo.findById.mockResolvedValue(makeResource({ fileUrl: undefined }));
    mockResourceRepo.delete.mockResolvedValue(undefined);

    await service.deleteResource("resource1");

    expect(mockUnlinkSync).not.toHaveBeenCalled();
    expect(mockResourceRepo.delete).toHaveBeenCalledWith("resource1");
  });
});

describe("ResourceService.getResourcesForStudent", () => {
  test("returns resources for student's school", async () => {
    mockStudentRepo.findById.mockResolvedValue(makeStudent());
    mockResourceRepo.findBySchool.mockResolvedValue([makeResource()]);

    const result = await service.getResourcesForStudent("student1");

    expect(mockStudentRepo.findById).toHaveBeenCalledWith("student1");
    expect(mockResourceRepo.findBySchool).toHaveBeenCalledWith("school1");
    expect(result).toHaveLength(1);
  });

  test("throws 'Student school not found' when student not found", async () => {
    mockStudentRepo.findById.mockResolvedValue(null);

    await expect(service.getResourcesForStudent("noStudent")).rejects.toThrow(
      "Student school not found"
    );
  });

  test("throws 'Student school not found' when student has no schoolId", async () => {
    mockStudentRepo.findById.mockResolvedValue(makeStudent({ schoolId: null }));

    await expect(service.getResourcesForStudent("student1")).rejects.toThrow(
      "Student school not found"
    );
  });
});