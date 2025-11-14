import express from 'express';
import { storeResult, getResultsByStudent } from '../controller/resultController';
import { schoolAuth } from '../middleware/school';

const router = express.Router();


router.post("/", schoolAuth, storeResult);

router.get("/student/:studentId", schoolAuth, getResultsByStudent);

export default router;