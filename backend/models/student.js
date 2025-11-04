// import pool from "../db.js";
// import bcrypt from "bcrypt";

// export const createStudent = async ({ firstname, lastname, school_id, class_name, password }) => {
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const res = await pool.query(
//     `INSERT INTO users 
//       (firstname, lastname, name, school_id, class, password, role)
//       VALUES ($1,$2,$3,$4,$5,$6,'student') RETURNING *`,
//     [firstname, lastname, `${school_id}_${firstname}`, school_id, class_name, hashedPassword]
//   );
//   return res.rows[0];
// };

// export const getStudentsBySchool = async (school_id) => {
//   const res = await pool.query(
//     "SELECT id, firstname, lastname, class, school_id FROM users WHERE school_id=$1 AND role='student'",
//     [school_id]
//   );
//   return res.rows;
// };
import pool from "../db.js";
import bcrypt from "bcrypt";

// Create a new student
export const createStudent = async ({ name, first_name, last_name, school_id, class_name, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const fullUsername = `${school_id}_${name}`;
  const res = await pool.query(
    `INSERT INTO users (name, firstname, lastname, school_id, class, password, role)
     VALUES ($1, $2, $3, $4, $5, $6, 'student') RETURNING *`,
    [fullUsername, first_name, last_name, school_id, class_name, hashedPassword]
  );
  return res.rows[0];
};

// Get all students for a specific school
export const getStudentsBySchool = async (school_id) => {
  const res = await pool.query(
    "SELECT id, name, firstname, lastname, class FROM users WHERE school_id = $1 AND role='student'",
    [school_id]
  );
  return res.rows;
};

// Update a student
// export const updateStudent = async (id, school_id, updates) => {
//   const fields = [];
//   const values = [];
//   let index = 1;
  
//   for (let key in updates) {
//     if (key === "password") continue; // handle password separately
//     fields.push(`${key} = $${index}`);
//     values.push(updates[key]);
//     index++;
//   }

//   let query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} AND school_id = $${index+1} AND role='student' RETURNING *`;
//   values.push(id, school_id);

//   const res = await pool.query(query, values);

//   // If password is provided, update it separately
//   if (updates.password) {
//     const hashedPassword = await bcrypt.hash(updates.password, 10);
//     const pwRes = await pool.query(
//       "UPDATE users SET password = $1 WHERE id = $2 AND school_id = $3 AND role='student' RETURNING *",
//       [hashedPassword, id, school_id]
//     );
//     return pwRes.rows[0];
//   }

//   return res.rows[0];
// };
export const updateStudent = async (id, school_id, updates) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (updates.class_name) {
    updates.class = updates.class_name;
    delete updates.class_name;
  }

  if (updates.name) {
    updates.name = `${school_id}_${updates.name}`;
  }

  for (let key in updates) {
    if (key === "password") continue; // handle password separately
    fields.push(`${key} = $${index}`);
    values.push(updates[key]);
    index++;
  }

  if (fields.length === 0) return null; // no valid fields to update

  const query = `
    UPDATE users 
    SET ${fields.join(", ")} 
    WHERE id = $${index} AND school_id = $${index + 1} AND role = 'student'
    RETURNING *;
  `;

  values.push(id, school_id);

  const res = await pool.query(query, values);

  if (updates.password) {
    const hashedPassword = await bcrypt.hash(updates.password, 10);
    const pwRes = await pool.query(
      `UPDATE users 
       SET password = $1 
       WHERE id = $2 AND school_id = $3 AND role='student'
       RETURNING *`,
      [hashedPassword, id, school_id]
    );
    return pwRes.rows[0];
  }

  return res.rows[0];
};


// Delete a student
export const deleteStudent = async (id, school_id) => {
  const res = await pool.query(
    "DELETE FROM users WHERE id = $1 AND school_id = $2 AND role='student' RETURNING *",
    [id, school_id]
  );
  return res.rows[0];
};
