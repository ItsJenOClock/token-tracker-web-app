import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser, createUser } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function UserLogin() {
  const [username, setUsername] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {login, redirectAfterLogin} = useAuth();
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
    <div className="flex flex-col items-center bg-gray-100">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg border border-gray-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Welcome!
        </h2>
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Please log in or create username to access.
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value ?? "")}
            className="w-full sm:w-auto flex-1 border border-gray-300 p-2 rounded-lg text-gray-700 focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Enter username to create or log in"
          />
        </div>
        <div className="flex mt-4 justify-center sm:flex-row w-full">
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md focus:outline-none focus:ring focus:ring-blue-400 cursor-pointer w-full sm:w-auto"
          >
            <i class="fa-solid fa-right-to-bracket"></i> Log In
          </button>
          <button
            onClick={handleSignup}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md focus:outline-none focus:ring focus:ring-green-400 cursor-pointer w-full sm:w-auto ml-4"
          >
            <i class="fa-solid fa-id-badge"></i> Create User
          </button>
        </div>
        {errorMessage && (
          <div className="mt-4 text-red-500 text-sm text-center">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}