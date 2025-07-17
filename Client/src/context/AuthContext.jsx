import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setSessionStorage } from "../utils/UserSession";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const login = (pagekey) => {
    if (!pagekey) return;
    if (typeof window !== "undefined") {
      setSessionStorage(`${pagekey}_isLoggedIn`, true);
      setAuthenticated(true);
    }
  };

  const value = useMemo(
    () => ({
      login,
      authenticated,
    }),
    [authenticated]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
