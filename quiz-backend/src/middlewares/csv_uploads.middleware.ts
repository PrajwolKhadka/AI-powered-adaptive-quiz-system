import multer, {FileFilterCallback} from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
// import uuid from "uuid";
import {v4 as uuidv4} from "uuid";

const csvUploadDir = path.join(__dirname, "../../uploads/csv");

if(!fs.existsSync(csvUploadDir)){
    fs.mkdirSync(csvUploadDir, {recursive: true});
}

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, csvUploadDir);
    },
    filename:(req, file, cb)=>{
        const extension = path.extname(file.originalname);
        cb(null, `csv-${uuidv4()}${extension}`);
    }
});

const csvFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const isCsv = file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv");
    
    if (isCsv) {
        cb(null, true);
    } else {
        cb(new Error("Please upload only CSV files") as any, false);
    }
};
export const uploadCSV = multer({
    storage,
    fileFilter: csvFileFilter,
    limits: {
        fileSize: 10* 1024 * 1024,
    },
});