"use client";

import { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { fetchAPI } from "@/lib/api";

// Bổ sung interface Pagination
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  // Thêm state phân trang
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Cố định 10 đơn hàng mỗi trang

  const [loading, setLoading] = useState(true);

  // Cập nhật hàm gọi API nhận tham số page
  const loadOrders = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetchAPI(`/orders/admin?page=${page}&limit=${limit}`);
      if (res.success) {
        setOrders(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Lỗi fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động fetch lại khi đổi trang
  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!confirm(`Bạn muốn chuyển trạng thái đơn hàng thành ${newStatus}?`)) return;
    
    try {
      await fetchAPI(`/orders/admin/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      alert("Cập nhật trạng thái thành công!");
      loadOrders(currentPage); // Giữ nguyên trang hiện tại sau khi cập nhật
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'PAID': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      case 'SHIPPED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <PageBreadCrumb pageTitle="Quản lý Đơn hàng" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Danh sách Đơn hàng
        </h3>

        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Mã ĐH</th>
                    <th className="px-6 py-3">Khách hàng</th>
                    <th className="px-6 py-3">Tổng tiền</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3 text-right">Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white truncate max-w-[120px]" title={order.id}>
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{order.customer_name}</p>
                        <p className="text-xs">{order.customer_email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {Number(order.total).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select 
                          className="rounded border border-gray-300 p-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                          disabled={order.status === 'CANCELLED'}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8">Chưa có đơn hàng nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Giao diện Pagination */}
            {pagination && pagination.totalPages > 0 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hiển thị trang <span className="font-semibold text-gray-900 dark:text-white">{pagination.currentPage}</span> / {pagination.totalPages} 
                  <span className="ml-2 hidden sm:inline">(Tổng {pagination.totalItems} đơn hàng)</span>
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