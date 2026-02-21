import { ResourceModel } from "../models/resource.model";
import { Student } from "../models/student.model";

export class ResourceRepository {
  async create(data: any) {
    return await ResourceModel.create(data);
  }

  async findBySchool(schoolId: string) {
    return await ResourceModel.find({ schoolId }).sort({ createdAt: -1 });
  }

  async findAll() {
    return await ResourceModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    return await ResourceModel.findById(id);
  }

  async update(id: string, data: any) {
    return await ResourceModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return await ResourceModel.findByIdAndDelete(id);
  }
}