export type ResourceType = "BOOK" | "RESOURCE";
export type ResourceFormat = "PDF" | "LINK";

export interface CreateResourceInput {
  title: string;
  description?: string;
  type: ResourceType;
  format: ResourceFormat;
  linkUrl?: string;
  fileUrl?: string;
  schoolId: string;
}

export interface UpdateResourceInput {
  title?: string;
  description?: string;
  type?: ResourceType;
  format?: ResourceFormat;
  linkUrl?: string;
  fileUrl?: string;
}