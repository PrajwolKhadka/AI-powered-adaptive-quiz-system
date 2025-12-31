import { Request, Response } from "express";
import { registerSchoolDto } from "../dtos/school.dto";
import { loginDto } from "../dtos/auth.dto";
import { AuthService } from "../services/auth.services";

export const registerSchool = async (req: Request, res: Response) => {
  try{
  const data = registerSchoolDto.parse(req.body);
  await AuthService.registerSchool(data);
  res.status(201).json({
    message: "Registration successful",
  });
}
  catch(err:any){
    res.status(400).json({error: err.message || "Registration failed"});
  }
};

export const login = async (req: Request, res: Response) => {
  try{
  const { email, password } = loginDto.parse(req.body);
  const result = await AuthService.login(email, password);
  res.json(result);
  }catch(err:any){({error: err.message || "Login failed"});}
};
