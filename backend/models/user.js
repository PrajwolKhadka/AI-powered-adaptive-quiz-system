// import pool from "../db.js";

// export const findUserBySchoolId = async (schoolId) => {
//   const res = await pool.query("SELECT * FROM users WHERE school_id = $1", [schoolId]);
//   return res.rows[0];
// };

// export const createUser = async (name, schoolId, className, hashedPassword) => {
//   const res = await pool.query(
//     "INSERT INTO users (name, school_id, class, password) VALUES ($1, $2, $3, $4) RETURNING *",
//     [name, schoolId, className, hashedPassword]
//   );
//   return res.rows[0];
// };

  import pool from "./db.js";
  import bcrypt from "bcrypt";

  export const createUser = async ({ first_name, last_name, name, school_id, class_name, password, role }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await pool.query(
      `INSERT INTO users 
      (firstname, lastname, name, school_id, class, password, role) 
      VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [first_name, last_name, name, school_id, class_name, hashedPassword, role]
    );
    return res.rows[0];
  };

  export const findUserBySchool = async (school_id) => {
    const res = await pool.query("SELECT * FROM users WHERE school_id = $1 AND role='student'", [school_id]);
    return res.rows;
  };

  export const findUserByName = async (name) => {
    const res = await pool.query("SELECT * FROM users WHERE name = $1", [name]);
    return res.rows[0];
  };
