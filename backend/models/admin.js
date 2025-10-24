import pool from "../db.js";
import bcrypt from "bcrypt";

export const createSchoolAdmin = async (name, schoolId, password) => {
  const hashed = await bcrypt.hash(password, 10);
  const res = await pool.query(
    "INSERT INTO users (name, school_id, password, role) VALUES ($1, $2, $3, 'schooladmin') RETURNING *",
    [name, schoolId, hashed]
  );
  return res.rows[0];
};

export const getAllSchoolAdmins = async () => {
  const res = await pool.query("SELECT * FROM users WHERE role='schooladmin'");
  return res.rows;
};
