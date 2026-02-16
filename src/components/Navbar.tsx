import { jwtDecode } from "jwt-decode";
import React from "react";
import { Link } from "react-router-dom";
import type { MyTokenPayload } from "../types";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  username?: string;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  onLogout,
  username,
  isAdmin,
}) => {
  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
         
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-all active:scale-95"
          >
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-black bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              SPRING SHOP
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    title="Панель управления"
                    className="bg-amber-50 text-amber-600 px-3 py-2 rounded-xl text-sm font-bold hover:bg-amber-100 transition-all border border-amber-200 flex items-center gap-1"
                  >
                    <span className="text-lg">🛡️</span>
                    <span className="hidden sm:inline">Админ</span>
                  </Link>
                )}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-gray-400 font-medium">
                    Привет,
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {username}
                  </span>
                </div>

               
                <Link
                  to="/history"
                  title="История заказов"
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors active:scale-90 flex items-center"
                >
                  <span className="text-xl">📜</span>
                </Link>

                
                <Link
                  to="/cart"
                  title="Корзина"
                  className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors active:scale-90 flex items-center"
                >
                  <span className="text-xl">🛍️</span>
                  <span className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                    !
                  </span>
                </Link>

                <Link
                  to="/login"
                  onClick={handleLogoutClick}
                  className="ml-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-all active:scale-95"
                >
                  Выйти
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
