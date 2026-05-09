"use client";

import React, { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: any;
}

export default function CategoryModal({ isOpen, onClose, onSuccess, categoryToEdit }: CategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    parent_id: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchAPI('/categories?limit=100').then((res) => {
        if (res.success) setCategories(res.data.data);
      });
      
      if (categoryToEdit) {
        setFormData({
          name: categoryToEdit.name,
          parent_id: categoryToEdit.parent_id || "",
        });
      } else {
        setFormData({ name: "", parent_id: "" });
      }
    }
  }, [isOpen, categoryToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = categoryToEdit ? `/categories/${categoryToEdit.id}` : '/categories';
      const method = categoryToEdit ? 'PUT' : 'POST';
      
      const payload = {
        name: formData.name,
        parent_id: formData.parent_id || null,
      };

      await fetchAPI(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      alert(`${categoryToEdit ? "Cập nhật" : "Thêm mới"} thành công!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <h3 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
          {categoryToEdit ? "Chỉnh sửa Danh mục" : "Thêm Danh mục Mới"}
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tên danh mục</label>
            <input 
              type="text" required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục cha (Tùy chọn)</label>
            <select 
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:border-blue-500"
              value={formData.parent_id} 
              onChange={(e) => setFormData({...formData, parent_id: e.target.value})}
            >
              <option value="">-- Không có --</option>
              {categories
                .filter(cat => cat.id !== categoryToEdit?.id)
                .map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Hủy
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? "Đang xử lý..." : "Lưu lại"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}