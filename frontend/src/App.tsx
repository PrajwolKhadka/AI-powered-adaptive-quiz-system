import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import Login from "./pages/login";
import Quiz from "./pages/quiz";
import SuperAdmin from "./pages/superadmin";
import Admin from "./pages/admin";

type DecodedToken = {
  exp: number; // expiry in seconds since epoch
  id: number;
  role: string;
};

const App: React.FC = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  // Check token on app load
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       const decoded: DecodedToken = jwtDecode(token);
  //       const now = Date.now() / 1000;
  //       if (decoded.exp < now) {
  //         // token expired
  //         localStorage.removeItem("token");
  //         setUser(null);
  //       } else {
  //         setUser(decoded);
  //         // auto logout when token expires
  //         const timeout = (decoded.exp - now) * 1000;
  //         setTimeout(() => {
  //           alert("Session expired. Please login again.");
  //           localStorage.removeItem("token");
  //           setUser(null);
  //         }, timeout);
  //       }
  //     } catch (err) {
  //       console.error("Invalid token");
  //       localStorage.removeItem("token");
  //       setUser(null);
  //     }
  //   }
  // }, []);
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded: DecodedToken = jwtDecode(token);
          const now = Date.now() / 1000;
          if (decoded.exp < now) {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setUser(null);
          } else {
            setUser(decoded);
          }
        } catch (err) {
          console.error("Invalid token");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkToken();

    // Listen for manual localStorage changes (like logout in another tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "token") checkToken();
    };
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Auto logout when token expires
  useEffect(() => {
    if (!user) return;
    const now = Date.now() / 1000;
    const timeout = (user.exp - now) * 1000;
    const timer = setTimeout(() => {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setUser(null);
    }, timeout);
    return () => clearTimeout(timer);
  }, [user]);

  const ProtectedRoute = (
    {
      element,
      allowedRoles,
    }:{
      element:React.ReactElement;
      allowedRoles : string[];
    })=>{
      if(!user) return <Navigate to="/"/>
      if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
      return element;
    };

  return (
     <Router>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "superadmin" ? (
                <Navigate to="/superadmin" />
              ) : user.role === "schooladmin" ? (
                <Navigate to="/admin" />
              ) : user.role === "student" ? (
                <Navigate to="/quiz" />
              ):(
                <Navigate to="/unauthorized" replace />
              )):(
                <Login setUser={setUser} />
              )
          }
        />

        {/* Quiz (normal users) */}
        <Route
          path="/quiz"
          element={<ProtectedRoute element={<Quiz />} allowedRoles={["student"]} />}
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={<ProtectedRoute element={<Admin />} allowedRoles={["schooladmin"]} />}
        />

        {/* Superadmin */}
        <Route
          path="/superadmin"
          element={<ProtectedRoute element={<SuperAdmin />} allowedRoles={["superadmin"]} />}
        />

        {/* Unauthorized Fallback */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center text-red-500 text-lg font-semibold">
              Unauthorized Access 🚫
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
