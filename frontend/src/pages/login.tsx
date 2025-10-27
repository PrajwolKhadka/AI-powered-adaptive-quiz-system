// import React, { useState } from "react";
// import axios from "axios";
// import {jwtDecode} from "jwt-decode";

// type LoginProps = {
//   setUser: (user: any) => void;
// };

// const Login: React.FC<LoginProps> = ({ setUser }) => {
//   const [name, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await axios.post("http://localhost:5000/api/auth/login", {
//         name,
//         password,
//       });

//       const { token } = res.data;
//       localStorage.setItem("token", token);

//       // Decode token
//       const decoded = await jwtDecode(token)
//       setUser(decoded);

//       setLoading(false);
//     } catch (err: any) {
//       setError(err.response?.data?.msg || "Login failed");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         className="bg-white p-8 rounded shadow-md w-full max-w-sm"
//         onSubmit={handleLogin}
//       >
//         <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <label className="block mb-2">Username</label>
//         <input
//           type="text"
//           className="w-full p-2 mb-4 border rounded"
//           value={name}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />

//         <label className="block mb-2">Password</label>
//         <input
//           type="password"
//           className="w-full p-2 mb-4 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;


import type React from "react"
import { useState } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { Eye, EyeOff, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"

type LoginProps = {
  setUser?: (user: any) => void
}


const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [name, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        name,
        password,
      })

      const { token,role } = res.data
      localStorage.setItem("token", token)
      localStorage.setItem("role", role)

      const decoded = jwtDecode(token)
      setUser?.(decoded)

       if (role === "superadmin") navigate("/superadmin");
      else if (role === "schooladmin") navigate("/admin");
      else if (role === "student") navigate("/quiz");
      else navigate("/");

      setLoading(false)
    } catch (err: any) {
      setError(err.response?.data?.msg || "Login failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header with icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/20">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">MaanakSutra</h1>
          <p className="text-slate-400 text-sm">Measure Your Mastery, Precisely</p>
        </div>

        {/* Login form card */}
        <form
          className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8 shadow-2xl"
          onSubmit={handleLogin}
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Username field */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-200 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              placeholder="Enter your username"
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Password field with show/hide toggle */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 pr-12"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 mb-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">Secure login powered by advanced authentication</p>
      </div>
    </div>
  )
}

export default Login
