import axiosInstance from "./axios";

export const fetchStudents = async () => {
  const res = await axiosInstance.get("/api/school/students");
  return res.data.students;
};

export const createStudent = async (formData: FormData) => {
  const res = await axiosInstance.post("/api/school/create-student", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateStudent = async (id: string, formData: FormData) => {
  const res = await axiosInstance.put(`/api/school/students/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteStudent = async (id: string) => {
  await axiosInstance.delete(`/api/school/students/${id}`);
};

export const deleteBatchStudents = async (ids: string[]) => {
  const res = await axiosInstance.post("/api/school/students/delete-batch", { studentIds: ids });
  return res.data;
};
