import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import Login from "./pages/login";
import Quiz from "./pages/quiz";

type DecodedToken = {
  exp: number; // expiry in seconds since epoch
  id: number;
  role: string;
};

const App: React.FC = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  // Check token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          // token expired
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser(decoded);
          // auto logout when token expires
          const timeout = (decoded.exp - now) * 1000;
          setTimeout(() => {
            alert("Session expired. Please login again.");
            localStorage.removeItem("token");
            setUser(null);
          }, timeout);
        }
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/quiz" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/quiz"
          element={user ? <Quiz /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
