import pool from "../db.js";

// export const getQuestionsByDifficulty = async (difficulty) => {
//   const res = await pool.query(
//     "SELECT * FROM questions WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 1",
//     [difficulty]
//   );
//   return res.rows[0];
// };
export const getQuestionsByDifficulty = async (difficulty, excludeIds = []) => {
  let query = "SELECT * FROM questions WHERE difficulty = $1";
  let params = [difficulty];

  if (excludeIds.length > 0) {
    const placeholders = excludeIds.map((_, i) => `$${i + 2}`).join(",");
    query += ` AND id NOT IN (${placeholders})`;
    params = [difficulty, ...excludeIds];
  }

  query += " ORDER BY RANDOM() LIMIT 1";

  const res = await pool.query(query, params);
  return res.rows[0] || null; // return null if no question left
};

export const seedQuestions = async (questions) => {
  for (const q of questions) {
    await pool.query(
      "INSERT INTO questions (question_text, options, correct_option, difficulty) VALUES ($1, $2, $3, $4)",
      [q.question_text, JSON.stringify(q.options), q.correct_option, q.difficulty]
    );
  }
};
