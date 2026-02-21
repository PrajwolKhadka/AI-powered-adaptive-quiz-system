import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ResourceService } from "../services/resource.service";
import { createResourceDto, updateResourceDto } from "../dtos/resource.dto";
import { StudentRepository } from "../repositories/student.repository";
import { unlinkSync } from "fs";
import { ResourceDocument } from "../models/resource.model";
import path from "path";
const studentRepository = StudentRepository;
const resourceService = new ResourceService();
const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createResourceDto.parse(req.body);

    let fileUrl: string | undefined;

    if (parsed.format === "PDF") {
      if (!req.file) {
        return res.status(400).json({
          message: "PDF file required",
        });
      }
      fileUrl = `${baseUrl}/uploads/pdf/${req.file.filename}`;
    } else if (parsed.format === "LINK") {
      if (!parsed.linkUrl) {
        return res.status(400).json({
          message: "Link URL required",
        });
      }
    }

    const resource = await resourceService.createResource({
      ...parsed,
      fileUrl,
      schoolId: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSchoolResources = async (req: AuthRequest, res: Response) => {
  const resources = await resourceService.getSchoolResources(req.user!.id);

  return res.json({
    success: true,
    data: resources,
  });
};

// export const getStudentResources = async (req: AuthRequest, res: Response) => {
//   const studentId = req.user!.id;
//     const student = await studentRepository.findById(studentId);

//   if (!student || !student.schoolId) {
//     return res.status(400).json({
//       message: "Student school not found",
//     });
//   }

//   const resources = await resourceService.getResourcesBySchool(student.schoolId.toString());

//   return res.json({
//     success: true,
//     data: resources,
//   });
// };
export const getStudentResources = async (req: AuthRequest, res: Response) => {
  try {
    const resources = await resourceService.getResourcesForStudent(req.user!.id);
    return res.json({ success: true, data: resources });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateResource = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await resourceService.getResourceById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Resource not found" });
    if (existing.schoolId.toString() !== req.user!.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const parsed = updateResourceDto.parse(req.body);
    const newFilePath = req.file ? `${baseUrl}/uploads/pdf/${req.file.filename}` : undefined;
    const updated = await resourceService.updateResource(req.params.id, parsed, newFilePath);

    return res.json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteResource = async (req: AuthRequest, res: Response) => {
  const existing = await resourceService.getResourceById(req.params.id);

  if (!existing) {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (!existing.schoolId || existing.schoolId.toString() !== req.user!.id) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await resourceService.deleteResource(req.params.id);

  return res.json({
    success: true,
    message: "Resource deleted",
  });
};
