import axiosInstance from "./axios";
import { API } from "./endpoints";

interface ResourcePayload {
  title: string;
  description?: string;
  type: "BOOK" | "RESOURCE";
  format: "PDF" | "LINK";
  linkUrl?: string;
  file?: File;
}

export const ResourcesAPI = {
  getSchoolResources: async () => {
    const res = await axiosInstance.get(API.RESOURCES.GET_SCHOOL_RESOURCES);
    return res.data.data;
  },

  createResource: async (payload: ResourcePayload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description || "");
    formData.append("type", payload.type);
    formData.append("format", payload.format);
    if (payload.format === "PDF" && payload.file) formData.append("file", payload.file);
    if (payload.format === "LINK" && payload.linkUrl) formData.append("linkUrl", payload.linkUrl);

    const res = await axiosInstance.post(API.RESOURCES.UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  updateResource: async (id: string, payload: ResourcePayload) => {
    const formData = new FormData();
    formData.append("title", payload.title);
    formData.append("description", payload.description || "");
    formData.append("type", payload.type);
    formData.append("format", payload.format);
    if (payload.format === "PDF" && payload.file) formData.append("file", payload.file);
    if (payload.format === "LINK" && payload.linkUrl) formData.append("linkUrl", payload.linkUrl);

    const res = await axiosInstance.put(API.RESOURCES.UPDATE.replace(":id", id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  deleteResource: async (id: string) => {
    const res = await axiosInstance.delete(API.RESOURCES.DELETE.replace(":id", id));
    return res.data;
  },

getStudentResources: async () => {
  const res = await axiosInstance.get(API.RESOURCES.GET_STUDENT_RESOURCES);
  return res.data.data;
},

};