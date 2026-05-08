"use client";

import { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { fetchAPI } from "@/lib/api";
import Button from "@/components/ui/button/Button"; 

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await fetchAPI('/categories');
      if (res.success) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await fetchAPI(`/categories/${id}`, { method: 'DELETE' });
      alert("Xóa thành công!");
      loadCategories();
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Quản lý Danh mục" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách danh mục
          </h3>
          <Button>Thêm Danh Mục</Button>
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Tên danh mục</th>
                  <th className="px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                    <td className="px-6 py-4">{cat.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cat.name}</td>
                    <td className="px-6 py-4 flex gap-3">
                      <button className="text-blue-600 hover:underline">Sửa</button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}