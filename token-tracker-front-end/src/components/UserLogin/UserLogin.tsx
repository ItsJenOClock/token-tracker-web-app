import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser, createUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function UserLogin() {
  const [username, setUsername] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, redirectAfterLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage(null);
    try {
      const response = await loginUser(username);
      if (response.success) {
        login(username ?? "");
        navigate(redirectAfterLogin || "/");
      } else {
        setErrorMessage(response.message ?? "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleSignup = async () => {
    try {
      await createUser(username);
      login(username ?? "");
      navigate(redirectAfterLogin || "/");
    } catch (error) {
      console.error("Signup failed", error);
      setErrorMessage("Failed to create user. Try a different username.");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value ?? "")}
      />
      <button onClick={handleLogin}>Log In</button>
      {errorMessage && (
        <div>
          <p>{errorMessage}</p>
        </div>
      )}
      <button onClick={handleSignup}>Create Username</button>
    </div>
  );
}
