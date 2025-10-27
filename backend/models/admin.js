import pool from "../db.js";
import bcrypt from "bcrypt";
//superadmin
export const createSchoolAdmin = async (name, schoolId, password) => {
  const hashed = await bcrypt.hash(password, 10);
  const res = await pool.query(
    "INSERT INTO users (name, school_id, password, role) VALUES ($1, $2, $3, 'schooladmin') RETURNING *",
    [name, schoolId, hashed]
  );
  return res.rows[0];
};
export const updateSchoolAdmin = async (id, name, schoolId) => {
  if (!name || !schoolId) throw new Error("Name and School ID are required");

  const res = await pool.query(
    "UPDATE users SET name=$1, school_id=$2 WHERE id=$3 AND role='schooladmin' RETURNING *",
    [name, schoolId, id]
  );

  if (!res.rows[0]) throw new Error("Admin not found");

  return res.rows[0];
};

export const getAllSchoolAdmins = async () => {
  const res = await pool.query("SELECT * FROM users WHERE role='schooladmin'");
  return res.rows;
};

export const deleteSchoolAdmin = async (id) => {
  await pool.query("DELETE FROM users WHERE id=$1 AND role='schooladmin'", [id]);
};

// export const resetSchoolAdminPassword = async (id, password) => {
//   const hashed = await bcrypt.hash(password, 10);
//   const res = await pool.query(
//     "UPDATE users SET password=$1 WHERE id=$2 AND role='schooladmin' RETURNING *",
//     [hashed, id]
//   );
//   return res.rows[0];
// };


export const resetSchoolAdminPassword = async (id, password) => {
  if (!password) throw new Error("Password is required");

  const hashed = await bcrypt.hash(password, 10);

  const res = await pool.query(
    "UPDATE users SET password=$1 WHERE id=$2 RETURNING *",
    [hashed, id]
  );

  if (!res.rows[0]) throw new Error("Admin not found");

  return res.rows[0]; // no need to return plain password
};

