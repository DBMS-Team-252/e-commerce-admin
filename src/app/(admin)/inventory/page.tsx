"use client";

import React, { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { fetchAPI } from "@/lib/api";

// Bổ sung interface Pagination theo chuẩn API
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  // Thêm state để quản lý phân trang
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Giới hạn 10 sản phẩm mỗi trang

  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [importQty, setImportQty] = useState<number>(0);

  // Cập nhật hàm gọi API để nhận tham số page và limit
  const loadInventory = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetchAPI(`/inventory?page=${page}&limit=${limit}`);
      if (res.success) {
        setInventory(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Lỗi fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động load dữ liệu mỗi khi đổi trang
  useEffect(() => {
    loadInventory(currentPage);
  }, [currentPage]);

  const handleImportSubmit = async (productId: string) => {
    if (importQty <= 0) return alert("Số lượng nhập phải lớn hơn 0");
    
    try {
      await fetchAPI('/inventory/transaction', {
        method: 'POST',
        body: JSON.stringify({
          productId: productId,
          type: "IMPORT",
          quantity: importQty,
          reason: "Nhập thêm hàng hóa định kỳ"
        }),
      });
      alert("Cập nhật kho thành công!");
      setEditingId(null);
      setImportQty(0);
      loadInventory(currentPage); // Giữ nguyên trang hiện tại sau khi nhập kho
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  // Hàm xử lý điều hướng trang
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Quản lý Tồn Kho" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Tình trạng Kho hàng
        </h3>

        {loading ? (
          <div className="text-center py-10 dark:text-white text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Mã SP</th>
                    <th className="px-6 py-3">Tên sản phẩm</th>
                    <th className="px-6 py-3 text-center">Tồn kho hiện tại</th>
                    <th className="px-6 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.product_id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 truncate max-w-[80px]" title={item.product_id}>
                        {item.product_id}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {item.product_name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 text-sm rounded-full font-bold ${item.stock < 10 ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500'}`}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingId === item.product_id ? (
                          <div className="flex justify-end items-center gap-2">
                            <input 
                              type="number" 
                              min="1"
                              className="w-20 rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                              placeholder="SL"
                              value={importQty}
                              onChange={(e) => setImportQty(Number(e.target.value))}
                            />
                            <button onClick={() => handleImportSubmit(item.product_id)} className="text-green-600 font-medium hover:underline dark:text-green-500">Lưu</button>
                            <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline dark:text-gray-400">Hủy</button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => { setEditingId(item.product_id); setImportQty(0); }}
                            className="text-blue-500 hover:text-blue-700 font-medium"
                          >
                            + Nhập hàng
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8">Chưa có dữ liệu tồn kho.</td>
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
                  <span className="ml-2 hidden sm:inline">(Tổng {pagination.totalItems} mã sản phẩm)</span>
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