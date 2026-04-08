import { useState } from "react";
import api from "../api/axiosInstance";
import axios from "axios";

interface LoginProps {
  onLoginSuccess: (token: string) => void;
}

export const LoginPage: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  interface BackendError {
    error: string;
  }
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [isRegister, setIsRegister] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isRegister) {
        try {
          const res = await api.post("/users", {
            username,
            password,
            email,
          });
          alert("Успешная регистрация");
        } catch (err: unknown) {
          if (axios.isAxiosError(err)) {
            const serverError = err.response?.data as BackendError;
            alert(serverError?.error || "Произошла ошибка на сервере");
          } else if (err instanceof Error) {
            // Обычная ошибка (например, сети или JS)
            alert(err.message);
          } else {
            alert("Неизвестная ошибка");
          }
        }
      } else {
        const res = await api.post<{ token: string }>("/auth/login", {
          username,
          password,
        });
        const token = res.data.token;
        localStorage.setItem("token", token);
        onLoginSuccess(token);
      }
    } catch (err) {
      alert("Ошибка входа! Проверь логин и пароль.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      {isRegister ? (
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-gray-100"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Регистрация
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
            className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="email"
            placeholder="Почта"
            className="w-full p-3 mb-6 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex justify-between">
            <button
              onClick={() => setIsRegister(false)}
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md"
            >
              Войти
            </button>
            <button
              onClick={() => setIsRegister(true)}
              type="submit"
              className=" ml-1 w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md"
            >
              Зарегестрироваться
            </button>
          </div>
        </form>
      ) : (
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
          <div className="flex justify-between">
            <button
              onClick={() => setIsRegister(false)}
              type="submit"
              className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md"
            >
              Войти
            </button>
            <button
              onClick={() => setIsRegister(true)}
              type="submit"
              className=" ml-1 w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md"
            >
              Зарегестрироваться
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
