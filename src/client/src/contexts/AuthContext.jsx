import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      params.delete("token");
      const newUrl = window.location.pathname + (params.toString() ? `?${params}` : "");
      window.history.replaceState({}, "", newUrl);
    }

    getMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function Authenticated({ children }) {
  const { user } = useAuth();
  if (user === undefined || !user) return null;
  return children;
}

export function Unauthenticated({ children }) {
  const { user } = useAuth();
  if (user === undefined || user) return null;
  return children;
}
