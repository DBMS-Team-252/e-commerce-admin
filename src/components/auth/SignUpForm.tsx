"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const SignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "ADMIN",
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        alert("Đăng ký tài khoản ADMIN thành công! Giờ bạn có thể đăng nhập.");
        router.push("/signin");
      } else {
        setError(resData.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      setError("Không thể kết nối tới backend. Hãy chắc chắn server đang chạy ở port 3000.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="grid w-full max-w-[1000px] grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        <div className="flex flex-col items-center justify-center p-8 md:p-12">
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
            <h1 className="mb-6 text-center text-3xl font-bold text-slate-900 dark:text-white">Create Admin</h1>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Họ và Tên</label>
              <input
                type="text" required
                className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                type="email" required
                className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Số điện thoại</label>
              <input
                type="text" required
                className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="0901234567"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mật khẩu</label>
              <input
                type="password" required
                className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {loading ? "Đang xử lý..." : "Đăng Ký Admin"}
            </button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Đã có tài khoản? <a href="/signin" className="text-blue-600 hover:underline">Đăng nhập</a>
            </p>
          </form>
        </div>

        {/* Phần Giới thiệu (Bên phải) */}
        <div className="hidden flex-col items-center justify-center bg-[#1C2434] p-8 text-white md:flex relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
            <div className="flex items-center space-x-3 mb-2">
              <svg width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="60" height="60" rx="14" fill="#3C50E0" />
                <rect x="18" y="27" width="6" height="15" rx="3" fill="white" />
                <rect x="27" y="21" width="6" height="21" rx="3" fill="white" />
                <rect x="36" y="15" width="6" height="27" rx="3" fill="white" />
              </svg>
              <h2 className="text-3xl font-bold tracking-tight">TailAdmin</h2>
            </div>
            <p className="max-w-[280px] text-slate-300 text-sm leading-relaxed">
              Dành cho quản trị viên hệ thống E-commerce. Đăng ký để quản lý database và đơn hàng của bạn.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUpForm;