import dotenv from "dotenv";
dotenv.config({path: ".env.test"});

import { connectDatabaseTest } from "../database/db";
import mongoose from "mongoose";

beforeAll(async () => {
    await connectDatabaseTest();
});

afterAll(async () => {
    await mongoose.connection.close();
});