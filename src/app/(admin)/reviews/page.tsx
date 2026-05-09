"use client";

import React, { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { fetchAPI } from "@/lib/api";
import TrashIcon from "@/icons/trash.svg";

// Bổ sung interface Pagination theo chuẩn API
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  // Thêm state để quản lý phân trang
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Giới hạn 10 đánh giá mỗi trang

  const [loading, setLoading] = useState(true);

  // Cập nhật hàm gọi API để truyền tham số page và limit
  const loadReviews = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetchAPI(`/reviews/admin?page=${page}&limit=${limit}`);
      if (res.success) {
        setReviews(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Lỗi fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động load dữ liệu mỗi khi người dùng đổi trang
  useEffect(() => {
    loadReviews(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await fetchAPI(`/reviews/admin/${id}`, { method: 'DELETE' });
      alert("Xóa đánh giá thành công!");
      loadReviews(currentPage); // Tải lại trang hiện tại sau khi xóa
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const renderStars = (rating: number) => {
    return "⭐".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Hàm xử lý nút bấm chuyển trang
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Quản lý Đánh giá" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Danh sách Đánh giá từ Khách hàng
        </h3>

        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Sản phẩm</th>
                    <th className="px-6 py-3">Khách hàng</th>
                    <th className="px-6 py-3">Rating</th>
                    <th className="px-6 py-3">Nội dung</th>
                    <th className="px-6 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate max-w-[150px]">
                        {review.product_name}
                      </td>
                      <td className="px-6 py-4">
                        {review.customer_name}
                      </td>
                      <td className="px-6 py-4 text-yellow-500 tracking-widest">
                        {renderStars(review.rating)}
                      </td>
                      <td className="px-6 py-4 italic max-w-xs truncate" title={review.comment}>
                        "{review.comment}"
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(review.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 inline-flex items-center justify-center"
                          title="Xóa đánh giá"
                        >
                           <TrashIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8">Chưa có đánh giá nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Giao diện Pagination (Chỉ hiển thị khi có dữ liệu phân trang) */}
            {pagination && pagination.totalPages > 0 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hiển thị trang <span className="font-semibold text-gray-900 dark:text-white">{pagination.currentPage}</span> / {pagination.totalPages} 
                  <span className="ml-2 hidden sm:inline">(Tổng {pagination.totalItems} đánh giá)</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    Trước
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === pagination.totalPages}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}