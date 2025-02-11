import { Route, Routes, Link, Navigate, useLocation } from "react-router";
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
  const location = useLocation();
  const isActive = (path: string, withPrefix: boolean = false) => {
    if (withPrefix) {
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  };

  const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
    const {loggedInUser, setRedirectAfterLogin} = useAuth();
    const location = useLocation();

    if (!loggedInUser) {
      setRedirectAfterLogin(location.pathname);
      return <Navigate to="/login" replace/>;
    }
    return element;
  };

    return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/" onClick={() => setHomeKey((prev) => prev + 1)}>
              <i className="fa-solid fa-house"></i>
              <p>Home</p>
            </Link>
          </li>
          <li>
            <Link to="/token-palettes">
              <i className="fa-solid fa-palette"></i>
              <p>Token Palettes</p>
            </Link>
          </li>
          <li>
            <Link to="/start-game">
              <i class="fa-solid fa-trophy"></i>
              <p>Game</p>
            </Link>
          </li>

          {!loggedInUser ? (
            <li>
              <Link to="/login">
                <i class="fa-solid fa-user"></i>
                <p>Login / Create User</p>
              </Link>
            </li>
          ) : (
            <li>

              <p>{loggedInUser}
                <button onClick={logout}><i className="fa-solid fa-right-from-bracket"></i></button></p>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage key={homeKey} />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route
          path="/token-palettes"
          element={<ProtectedRoute element={<TokenPalettePage />} />}
        />
        <Route
          path="/token-palettes/:id"
          element={<ProtectedRoute element={<TokenPaletteDetailPage />} />}
        />
        <Route path="/token/:oracleId/:side" element={<TokenDetailsPage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route
          path="/start-game"
          element={<ProtectedRoute element={<StartGame />} />}
        />
        <Route path="/game/:id" element={<GameInstancePage />} />
      </Routes>
    </>
  );
};

export default App;
