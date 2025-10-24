import pool from "../db.js";

export const findUserBySchoolId = async (schoolId) => {
  const res = await pool.query("SELECT * FROM users WHERE school_id = $1", [schoolId]);
  return res.rows[0];
};

export const createUser = async (name, schoolId, className, hashedPassword) => {
  const res = await pool.query(
    "INSERT INTO users (name, school_id, class, password) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, schoolId, className, hashedPassword]
  );
  return res.rows[0];
};
