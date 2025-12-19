import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SchoolRepository } from "../repositories/school.repository";
import { SchoolStatus } from "../types/school.types";

const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL!;
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD!;

export const AuthService = {
  async registerSchool(data: any) {
    const exists = await SchoolRepository.findByEmail(data.email);
    if (exists) throw new Error("School already exists");

    const hashed = await bcrypt.hash(data.password, 10);

    return SchoolRepository.create({
      ...data,
      password: hashed,
    });
  },

  async login(email: string, password: string) {
    if (email === SUPERADMIN_EMAIL) {
      if (password !== SUPERADMIN_PASSWORD)
        throw new Error("Invalid credentials");

      return {
        role: "SUPERADMIN",
        token: jwt.sign(
          { role: "SUPERADMIN" },
          process.env.JWT_SECRET!
        ),
      };
    }

    const school = await SchoolRepository.findByEmail(email);
    if (!school) throw new Error("Invalid credentials");

    if (school.status !== SchoolStatus.VERIFIED)
      throw new Error("School not verified");

    const match = await bcrypt.compare(password, school.password);
    if (!match) throw new Error("Invalid credentials");

    return {
      role: "SCHOOL",
      token: jwt.sign(
        { id: school.id, role: "SCHOOL" },
        process.env.JWT_SECRET!
      ),
    };
  },
};
