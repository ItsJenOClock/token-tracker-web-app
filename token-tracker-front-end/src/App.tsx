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
import logo from "./assets/images/full_logo.png";

const App = () => {
  const { loggedInUser, logout } = useAuth();
  const [homeKey, setHomeKey] = useState(0);
  const location = useLocation();
  const isActive = (path: string, matchPrefixes: string[] = []) => {
    if (location.pathname === path) {
      return true;
    }
    return matchPrefixes.some((prefix) => location.pathname.startsWith(prefix));
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
      <header className="w-full flex justify-center py-4 bg-gray-100">
        <img
          src={logo}
          className={`transition-all h-full ${
            location.pathname === "/" && !location.search
              ? "h-24 sm:h-32"
              : "h-12 sm:h-16"
          }`}
        />
      </header>
      <main className="pb-80 bg-gray-100" >
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
      </main>
      <nav className="fixed bottom-0 w-full border-t border-gray-200 bg-white">
        <ul className="flex justify-between text-center text-xs sm:text-sm">
          <li className="flex-1">
            <Link
              to="/"
              className={`flex flex-col items-center p-2 ${
                isActive("/") ? "text-[#e26b00]" : "text-stone-700 hover:text-[#e26b00]"
              }`}
              onClick={() => setHomeKey((prev) => prev + 1)}
            >
              <i className="fa-solid fa-house text-lg sm:text-xl"></i>
              <span>Home</span>
            </Link>
          </li>

          <li className="flex-1">
            <Link
              to="/token-palettes"
              className={`flex flex-col items-center p-2 ${
                isActive("/token-palettes", ["/token-palettes/"]) ? "text-[#e26b00]" : "text-stone-700 hover:text-[#e26b00]"
              }`}
            >
              <i className="fa-solid fa-palette text-lg sm:text-xl"></i>
              <span>Palettes</span>
            </Link>
          </li>

          <li className="flex-1">
            <Link
              to="/start-game"
              className={`flex flex-col items-center p-2 ${
                isActive("/start-game", ["/game/"]) ? "text-[#e26b00]" : "text-stone-700 hover:text-[#e26b00]"
              }`}
            >
              <i className="fa-solid fa-trophy text-lg sm:text-xl"></i>
              <span>Game</span>
            </Link>
          </li>

          {!loggedInUser ? (
            <li className="flex-1">
              <Link
                to="/login"
                className={`flex flex-col items-center p-2 ${
                  isActive("/login") ? "text-[#e26b00]" : "text-stone-700 hover:text-[#e26b00]"
                }`}
              >
                <i className="fa-solid fa-user text-lg sm:text-xl"></i>
                <span>Login</span>
              </Link>
            </li>
          ) : (
            <li className="flex-1">
              <div className="flex flex-col items-center text-stone-700">
                <span>{loggedInUser}</span>
                <button
                  onClick={logout}
                  className="text-lg sm:text-xl hover:text-red-500 cursor-pointer"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                </button>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default App;