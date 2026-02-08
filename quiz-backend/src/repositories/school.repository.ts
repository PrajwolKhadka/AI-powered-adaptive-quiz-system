import { SchoolModel } from "../models/school.model";
import { CreateSchoolDTOType } from "../dtos/school.dto";

export const SchoolRepository = {
  create: (data: CreateSchoolDTOType) => {
    return SchoolModel.create(data);
  },

  findByEmail: (email: string) => {
    return SchoolModel.findOne({ email });
  },

  findBySchoolName: (name: string) => {
    return SchoolModel.findOne({ name });
  },

  updateById: (id: string, data: any) => {
    return SchoolModel.findByIdAndUpdate(id, data);
  },

  findByResetToken: (token: string) => {
    return SchoolModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    });
  },
};
