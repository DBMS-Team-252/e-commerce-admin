"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Khai báo API_URL linh hoạt: Ưu tiên đọc từ .env, nếu không có thì lấy localhost:3000
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Gọi API đăng nhập với thông tin email và password
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();

      if (resData.success) {
        // Đăng nhập thành công, lưu token vào LocalStorage
        localStorage.setItem("accessToken", resData.data.accessToken);
        if (resData.data.refreshToken) {
          localStorage.setItem("refreshToken", resData.data.refreshToken);
        }

        // Kiểm tra quyền của người dùng. Chỉ ADMIN mới được phép truy cập.
        if (resData.data.user.role === "ADMIN") {
          // Chuyển hướng đến trang chủ Admin (Dashboard)
          router.push("/");
        } else {
          // Nếu không phải ADMIN, hiển thị lỗi và xóa token đã lưu
          setError("Chỉ admin mới có quyền truy cập trang này.");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } else {
        // Hiển thị thông báo lỗi từ API
        setError(resData.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (err) {
      // Xử lý lỗi mạng hoặc lỗi không xác định
      setError("Có lỗi xảy ra khi kết nối đến máy chủ. Vui lòng thử lại sau.");
      console.error("Login error:", err);
    } finally {
      // Kết thúc trạng thái loading
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      {/* Bố cục split-panel chia đôi trang: Form bên trái, Giới thiệu bên phải */}
      <div className="grid w-full max-w-[1000px] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {/* Phần Form Đăng Nhập (Bên trái) */}
        <div className="flex flex-col items-center justify-center p-8 md:p-12">
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
            <h1 className="mb-8 text-center text-3xl font-bold text-slate-900 dark:text-white">Sign In</h1>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Trường nhập Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Trường nhập Mật khẩu */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Nút Đăng Nhập */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-400 dark:focus:ring-blue-800 transition-colors"
            >
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </button>
          </form>
        </div>

        {/* Phần Giới thiệu (Bên phải, nền xanh đậm - lấy cảm hứng từ ảnh template) */}
        <div className="hidden flex-col items-center justify-center bg-[#1C2434] p-8 text-white md:flex relative overflow-hidden">
          {/* Lưới background mờ mờ */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-4">
            {/* Logo TailAdmin */}
            <div className="flex items-center space-x-3 mb-2">
              <svg
                width="40"
                height="40"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="60" height="60" rx="14" fill="#3C50E0" />
                <rect x="18" y="27" width="6" height="15" rx="3" fill="white" />
                <rect x="27" y="21" width="6" height="21" rx="3" fill="white" />
                <rect x="36" y="15" width="6" height="27" rx="3" fill="white" />
              </svg>
              <h2 className="text-3xl font-bold tracking-tight">TailAdmin</h2>
            </div>
            <p className="max-w-[280px] text-center text-slate-300 text-sm leading-relaxed">
              Free and Open-Source Tailwind CSS Admin Dashboard Template
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignInForm;