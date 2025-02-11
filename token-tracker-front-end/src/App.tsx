import { Route, Routes, Link } from "react-router";
import HomePage from "./pages/HomePage/HomePage";
import TokenPalettePage from "./pages/TokenPalettePage/TokenPalettePage";
import TokenPaletteDetailPage from "./pages/TokenPaletteDetailPage/TokenPaletteDetailPage";
import TokenDetailsPage from "./pages/TokenDetailsPage/TokenDetailsPage";
import GameInstancePage from "./pages/GameInstancePage/GameInstancePage";
import UserLogin from "./components/UserLogin/UserLogin";
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import StartGame from "./pages/StartGamePage/StartGame";

const App = () => {
  const { loggedInUser, logout } = useAuth();
  const [homeKey, setHomeKey] = useState(0);

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/" onClick={() => setHomeKey((prev) => prev + 1)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/token-palettes">Token Palettes</Link>
          </li>
          {!loggedInUser ? (
            <li>
              <Link to="/login">Login / Create User</Link>
            </li>
          ) : (
            <li>
              <span>Logged in as: {loggedInUser}</span>
              <button onClick={logout}>Log Out</button>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage key={homeKey} />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route
          path="/token-palettes"
          element={loggedInUser ? <TokenPalettePage /> : <UserLogin />}
        />
        <Route
          path="/token-palettes/:id"
          element={loggedInUser ? <TokenPaletteDetailPage /> : <UserLogin />}
        />
        <Route path="/token/:oracleId/:side" element={<TokenDetailsPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route
          path="/start-game"
          element={loggedInUser ? <StartGame /> : <UserLogin />}
        />
        <Route path="/game/:id" element={<GameInstancePage />} />
      </Routes>
    </>
  );
};

export default App;
