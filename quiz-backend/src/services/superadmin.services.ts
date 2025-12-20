import jwt from "jsonwebtoken";
import { error } from "node:console";

const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL;
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD;

export const SuperAdminAuthService = {
    login(email: string, password: string){
        if(email != SUPERADMIN_EMAIL || password != SUPERADMIN_PASSWORD){
            throw new Error("Invalid Credential");
        }
        return jwt.sign(
            {role: "SUPERADMIN"}, process.env.JWT_SECRET!
        );
    },
};