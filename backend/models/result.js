import pool from "../db.js";

export const saveResult = async (userId, score, psychometric) => {
  const res = await pool.query(
    "INSERT INTO results (user_id, score, psychometric) VALUES ($1, $2, $3) RETURNING *",
    [userId, score, JSON.stringify(psychometric)]
  );
  return res.rows[0];
};

export const getResultByUserId = async (userId) => {
  const res = await pool.query(
    "SELECT * FROM results WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
    [userId]
  );
  return res.rows[0];
};



import mongoose from "mongoose";

const resultSchema = new mongoose.schema({
  studentId : {type: mongoose.Schema.Types.ObjectId, ref : 'Student', required : true},
  score : {type : int, required: true},
  pyschometricEvaluation : {type : String , required : false},
})

export default mongoose.model("Result", resultSchema);