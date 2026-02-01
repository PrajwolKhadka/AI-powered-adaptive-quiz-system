"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getAuthSession, logoutSession } from "@/lib/actions/auth-sessions";

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    setLoading(true);
    try {
      const session = await getAuthSession();
      setIsAuthenticated(session.isAuthenticated);
      setUser(session.user);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
     const interval = setInterval(async () => {
      const session = await getAuthSession();
      if (!session.isAuthenticated && isAuthenticated) {
        // token/user deleted externally → force logout
        setIsAuthenticated(false);
        setUser(null);
        router.replace("/login");
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const logout = async () => {
    await logoutSession();
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
