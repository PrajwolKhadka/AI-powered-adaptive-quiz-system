import { logout } from "../auth/logout";
import axiosInstance from "./axios";
import {API} from "./endpoints";
export const fetchStudents = async (params?: { search: string; page: number; limit: number; }) => {
  try{
  const res = await axiosInstance.get(API.CRUD.FETCH_STUDENTS, { params });
    // return res.data.students;
  return res.data;
}
  catch(err: any){
    if(err.response.status === 401){
      logout();
  }
  throw err;
  }
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

export const getProfile = async () => {
  const res = await axiosInstance.get(API.PROFILE.GET_PROFILE);
  return res.data.data;
};