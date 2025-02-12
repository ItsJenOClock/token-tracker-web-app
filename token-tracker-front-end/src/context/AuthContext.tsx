import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  loggedInUser: string | null;
  login: (username: string) => void;
  logout: () => void;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (route: string) => void;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(
    null
  );
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setLoggedInUser(savedUser);
    }
    setIsAuthLoading(false);
  }, []);

  const login = (username: string) => {
    localStorage.setItem("loggedInUser", username);
    setLoggedInUser(username);
  };

  const logout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        login,
        logout,
        redirectAfterLogin,
        setRedirectAfterLogin,
        isAuthLoading,
      }}
    >
      {!isAuthLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};