import path from "path";
import { ResourceDocument } from "../models/resource.model";
import { ResourceRepository } from "../repositories/resource.repository";
import { StudentRepository } from "../repositories/student.repository";
import { UpdateResourceInput } from "../types/resources.types";
import { unlinkSync } from "fs";

export class ResourceService {
  private resourceRepository = new ResourceRepository();
  private studentRepository = StudentRepository;

  async createResource(data: any) {
    return await this.resourceRepository.create(data);
  }

  async getSchoolResources(schoolId: string) {
    return await this.resourceRepository.findBySchool(schoolId);
  }

  async getAllResources() {
    return await this.resourceRepository.findAll();
  }

//   async updateResource(id: string, data: any) {
//     return await this.resourceRepository.update(id, data);
//   }
async updateResource(id: string, data: UpdateResourceInput, newFilePath?: string): Promise<ResourceDocument | null> {
  const existing = await this.resourceRepository.findById(id);
  if (!existing) throw new Error("Resource not found");

  if (newFilePath) {
    // delete old file
    if (existing.fileUrl) {
      const oldPath = path.join(__dirname, "../../", existing.fileUrl);
      try { unlinkSync(oldPath); } catch {}
    }
    data.fileUrl = newFilePath;
    data.format = "PDF";
  }

  return await this.resourceRepository.update(id, data);
}

 async deleteResource(id: string): Promise<void> {
  const existing = await this.resourceRepository.findById(id);
  if (existing?.fileUrl) {
    const filePath = path.join(__dirname, "../../", existing.fileUrl);
    try { unlinkSync(filePath); } catch {}
  }
  await this.resourceRepository.delete(id);
}

  async getResourceById(id: string) {
    return await this.resourceRepository.findById(id);
  }
  
  async getResourcesBySchool(schoolId: string) {
    return await this.resourceRepository.findBySchool(schoolId);
  }

  async getResourcesForStudent(studentId: string): Promise<ResourceDocument[]> {
  const student = await this.studentRepository.findById(studentId);
  if (!student || !student.schoolId) {
    throw new Error("Student school not found");
  }
  return await this.resourceRepository.findBySchool(student.schoolId.toString());
}
}
