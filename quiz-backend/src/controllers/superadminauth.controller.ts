import {Request, Response} from "express";
import { SuperAdminAuthService } from "../services/superadmin.services";
import { superAdminLoginDTO } from "../dtos/superadmin.dto";

export const loginSuperAdmin = (req: Request, res: Response)=> {
    try{
        const {email, password} = superAdminLoginDTO.parse(req.body);
        const token = SuperAdminAuthService.login(email,password);
        res.json({token});
    }
    catch(err:any){
        res.status(401).json({error: err.message});
    }
}