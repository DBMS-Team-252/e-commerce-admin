"use client";

import React, { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { fetchAPI } from "@/lib/api";
import Button from "@/components/ui/button/Button"; 
import CategoryModal from "@/components/ecommerce/CategoryModal";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const loadCategories = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetchAPI(`/categories?page=${page}&limit=${limit}`);
      
      if (res.success) {
        setCategories(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories(currentPage);
  }, [currentPage]);

  const openAddModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await fetchAPI(`/categories/${id}`, { method: 'DELETE' });
      alert("Xóa thành công!");
      loadCategories(currentPage);
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
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
          <Button onClick={openAddModal}>+ Thêm Danh Mục</Button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : (
          <>
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
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <tr key={cat.id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                        <td className="px-6 py-4 truncate max-w-[150px]" title={cat.id}>{cat.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cat.name}</td>
                        <td className="px-6 py-4 flex gap-3">
                          <button 
                            onClick={() => openEditModal(cat)}
                            className="text-blue-600 hover:underline"
                          >
                            Sửa
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id)}
                            className="text-red-600 hover:underline"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        Chưa có danh mục nào được tạo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 0 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hiển thị trang <span className="font-semibold text-gray-900 dark:text-white">{pagination.currentPage}</span> / {pagination.totalPages} 
                  <span className="ml-2 hidden sm:inline">(Tổng cộng {pagination.totalItems} danh mục)</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    Trước
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === pagination.totalPages}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <CategoryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadCategories(currentPage)}
        categoryToEdit={selectedCategory}
      />
    </div>
  );
}