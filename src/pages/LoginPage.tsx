import { useState } from "react";
import api from "../api/axiosInstance";


interface LoginProps {
  onLoginSuccess: () => void; 
}


export const LoginPage: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post<{ token: string }>("/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      onLoginSuccess();
    } catch (err) {
      alert("Ошибка входа! Проверь логин и пароль.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-gray-100"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Вход в магазин
        </h2>
        <input
          type="text"
          placeholder="Логин"
          className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md"
        >
          Войти
        </button>
      </form>
    </div>
  );
};
