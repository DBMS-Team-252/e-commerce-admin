"use client";

import React, { useState, useEffect } from "react";
import { fetchAPI } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  productToEdit?: any;
}

export default function ProductModal({ isOpen, onClose, onSuccess, productToEdit }: ProductModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    stock: 0,
  });

  useEffect(() => {
    if (isOpen) {
      // Sửa URL để lấy nhiều danh mục hơn cho Dropdown và trỏ đúng vào res.data.data
      fetchAPI('/categories?limit=100').then((res) => {
        if (res.success) setCategories(res.data.data); // FIX Ở ĐÂY NÈ
      });
      
      if (productToEdit) {
        setFormData({
          name: productToEdit.name,
          description: productToEdit.description,
          price: Number(productToEdit.price),
          category_id: productToEdit.category_id,
          stock: productToEdit.inventory?.stock || 0,
        });
      } else {
        setFormData({ name: "", description: "", price: 0, category_id: "", stock: 0 });
      }
    }
  }, [isOpen, productToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = productToEdit ? `/products/${productToEdit.id}` : '/products';
      const method = productToEdit ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      await fetchAPI(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      alert(`${productToEdit ? "Cập nhật" : "Thêm mới"} sản phẩm thành công!`);
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
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <h3 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
          {productToEdit ? "Chỉnh sửa Sản Phẩm" : "Thêm Sản Phẩm Mới"}
        </h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tên sản phẩm</label>
            <input 
              type="text" required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Giá (VNĐ)</label>
              <input 
                type="number" required min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Tồn kho</label>
              <input 
                type="number" required min="0" disabled={!!productToEdit} 
                className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white disabled:opacity-50"
                value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục</label>
            <select 
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
            <textarea 
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Hủy
            </button>
            <button type="submit" disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Đang lưu..." : "Lưu Sản Phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}