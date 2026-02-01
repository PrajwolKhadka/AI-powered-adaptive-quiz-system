import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { uploadProfilePictureDto } from "../dtos/student.dto";
import { StudentService } from "../services/student.service";

export const uploadStudentProfilePicture = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    uploadProfilePictureDto.parse(req.body);

    if (!req.file) {
      return res.status(400).json({ error: "Profile picture is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const student = await StudentService.uploadProfilePicture(
      req.user!.id,
      imageUrl,
    );

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: {
        id: student._id,
        imageUrl: student.imageUrl,
        isFirstLogin: student.isFirstLogin,
      },
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to upload profile picture",
    });
  }
};

export const getStudentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const student = await StudentService.getById(req.user!.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        fullName: student.fullName,
        email: student.email,
        className: student.className,
        imageUrl: student.imageUrl, // the path saved when uploading
        isFirstLogin: student.isFirstLogin,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch profile",
    });
  }
};