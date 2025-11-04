import React, { useEffect, useState } from "react";
import axios from "axios";

interface Result {
  id: number;
  user_id: number;
  score: number;
  psychometric: Record<string, any>;
  created_at: string;
  student_name: string;
}

const StudentResults: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/result/school", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResults(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p className="text-center">Loading results...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Students’ Results</h2>

      {results.length === 0 ? (
        <p>No results available.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-black">Student Name</th>
              <th className="border px-4 py-2 text-black">Score</th>
              <th className="border px-4 py-2 text-black">Psychometric</th>
              <th className="border px-4 py-2 text-black">Date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td className="border px-4 py-2">{result.student_name}</td>
                <td className="border px-4 py-2">{result.score}</td>
                <td className="border px-4 py-2">
                  {JSON.stringify(result.psychometric)}
                </td>
                <td className="border px-4 py-2">
                  {new Date(result.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentResults;
