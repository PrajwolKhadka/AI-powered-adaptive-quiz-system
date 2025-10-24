import React, { useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

type LoginProps = {
  setUser: (user: any) => void;
};

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        name,
        password,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);

      // Decode token
      const decoded = await jwtDecode(token)
      setUser(decoded);

      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.msg || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2">Username</label>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          value={name}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
