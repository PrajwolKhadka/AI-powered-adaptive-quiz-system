import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SchoolRepository } from "../repositories/school.repository";


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
    const school = await SchoolRepository.findByEmail(email);
    if (!school) throw new Error("Invalid credentials");

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
