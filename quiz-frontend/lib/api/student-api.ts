import axiosInstance from "./axios";
import {API} from "./endpoints";
export const fetchStudents = async (params?: { search: string; page: number; limit: number; }) => {
  const res = await axiosInstance.get("/api/school/students", { params });
  // return res.data.students;
  return res.data;

};

export const createStudent = async (formData: FormData) => {
  const res = await axiosInstance.post(API.CRUD.CREATE_STUDENT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateStudent = async (id: string, formData: FormData) => {
  const res = await axiosInstance.put(API.CRUD.UPDATE_STUDENT.replace(":id", id), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteStudent = async (id: string) => {
  await axiosInstance.delete(API.CRUD.DELETE_STUDENT.replace(":id", id));
};

export const deleteBatchStudents = async (ids: string[]) => {
  const res = await axiosInstance.post(API.CRUD.DELETE_BATCH_STUDENTS, { studentIds: ids });
  return res.data;
};
