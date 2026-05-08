"use client";

import React, { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { fetchAPI } from "@/lib/api";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [importQty, setImportQty] = useState<number>(0);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const res = await fetchAPI('/inventory');
      if (res.success) {
        setInventory(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

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
      loadInventory();
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Quản lý Tồn Kho" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Tình trạng Kho hàng
        </h3>

        {loading ? (
          <div className="text-center py-10 dark:text-white">Đang tải dữ liệu...</div>
        ) : (
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
                  <tr key={item.product_id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                    <td className="px-6 py-4 truncate max-w-[80px]" title={item.product_id}>
                      {item.product_id}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 text-sm rounded-full font-bold ${item.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === item.product_id ? (
                        <div className="flex justify-end items-center gap-2">
                          <input 
                            type="number" 
                            min="1"
                            className="w-20 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            placeholder="SL"
                            value={importQty}
                            onChange={(e) => setImportQty(Number(e.target.value))}
                          />
                          <button onClick={() => handleImportSubmit(item.product_id)} className="text-green-600 font-medium hover:underline">Lưu</button>
                          <button onClick={() => setEditingId(null)} className="text-gray-500 hover:underline">Hủy</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setEditingId(item.product_id); setImportQty(0); }}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          + Nhập hàng
                        </button>
                      )}
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