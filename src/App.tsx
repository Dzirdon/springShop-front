import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./components/Navbar";
import { LoginPage } from "./pages/LoginPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CartPage } from "./pages/CartPage";
import { HistoryPage } from "./pages/HistoryPage";
import { useState } from "react";
import { AdminPage } from "./pages/AdminPage";
import { jwtDecode } from "jwt-decode";
import type { MyTokenPayload } from "./types";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    !!localStorage.getItem("token"),
  );

  const token = localStorage.getItem("token");

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<MyTokenPayload>(token);
      return decoded.role === "ADMIN";
    } catch {
      return false;
    }
  });
  const [username, setUsername] = useState<string>("Покупатель");

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem("token", newToken);
    const decoded = jwtDecode<MyTokenPayload>(newToken);
    setUsername(decoded.sub);
    setIsAdmin(decoded.role === "ADMIN");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
       
        {isLoggedIn && (
          <Navbar
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
            isAdmin={isAdmin}
            username={username}
          />
        )}

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <Toaster position="bottom-right" />

          <Routes>
            {/* Если не авторизован — любой путь ведет на Login */}
            {!isLoggedIn ? (
              <>
                <Route
                  path="/login"
                  element={
                    <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
                  }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </>
            ) : (
              /* Авторизованные маршруты */
              <>
                <Route path="/" element={<CatalogPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/history" element={<HistoryPage />} />
                {/* Редирект с логина на главную, если уже вошел */}
                <Route path="/login" element={<Navigate to="/" replace />} />
                {/* 404 — на главную */}
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route
                  path="/admin"
                  element={
                    isAdmin ? <AdminPage /> : <Navigate to="/" replace />
                  }
                />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
