import { QuestionModel } from "../models/questions.model";

export const QuestionRepository = {
  insertMany(questions: any[]) {
    return QuestionModel.insertMany(questions);
  },

  findBySchool(schoolId: string) {
    return QuestionModel.find({ schoolId });
  },

  deleteBySchool(schoolId: string) {
    return QuestionModel.deleteMany({ schoolId });
  },
  
  async findById(id: string) {
    return QuestionModel.findById(id);
  },

  async findByIds(ids: string[]) {
    return QuestionModel.find({ _id: { $in: ids } });
  }
};
