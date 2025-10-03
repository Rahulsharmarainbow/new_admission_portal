import { useState, useEffect, createContext, useContext } from "react";
import { useCookies } from "react-cookie";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  login_type: number;
  profile?: string;
  whatsapp_status: number;
  email_status: number;
  sms_status: number;
  token?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user", "token"]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (cookies.user) {
      setUser(cookies.user);
    }
  }, [cookies.user]);

  const login = (userData: User) => {
    setUser(userData);
    setCookie("user", userData, { path: "/", maxAge: 30 * 24 * 60 * 60 });
    if (userData.token) {
      setCookie("token", userData.token, { path: "/", maxAge: 30 * 24 * 60 * 60 });
    }
  };

  const logout = () => {
    setUser(null);
    removeCookie("user", { path: "/" });
    removeCookie("token", { path: "/" });
    window.location.href = "/login";
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.token,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
