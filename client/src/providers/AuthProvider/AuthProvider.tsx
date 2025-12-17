import { useContext, createContext, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
}

// enum ROLE {
//   'USER',
//   'ADMIN',
// }

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string;
  loginAction: (data: LoginData, url: string) => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: ProviderProps) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );

  const navigate = useNavigate();

  const loginAction = async (data: LoginData, url: string) => {
    try {
      const response = await fetch(`${url}auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const jsonData = await response.json();

      if (jsonData?.access_token) {
        const newUser = { name: jsonData.name, role: jsonData.role };

        setUser(newUser);
        setToken(jsonData.access_token);

        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("token", jsonData.access_token);

        navigate("/");
        return;
      }

      throw new Error("Invalid login response");
    } catch (e) {
      console.error(e);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
};
