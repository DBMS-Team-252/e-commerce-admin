"use client";

import { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import ProductModal from "@/components/ecommerce/ProductModal";
import { fetchAPI } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchAPI('/products?limit=50'); 
      if (res.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có thực sự muốn xóa sản phẩm này?")) return;
    try {
      await fetchAPI(`/products/${id}`, { method: 'DELETE' });
      loadProducts();
    } catch (error: any) {
      alert(`Xóa thất bại: ${error.message}`);
    }
  };

  const openAddModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Quản lý Sản phẩm" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách Sản phẩm
          </h3>
          <Button onClick={openAddModal}>+ Thêm Sản Phẩm</Button>
        </div>

        {loading ? (
          <div className="text-center py-10 dark:text-white">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="bg-gray-50 uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Tên Sản phẩm</th>
                  <th className="px-6 py-3">Danh mục</th>
                  <th className="px-6 py-3">Giá (VNĐ)</th>
                  <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">{item.category?.name || 'N/A'}</td>
                    <td className="px-6 py-4">{Number(item.price).toLocaleString('vi-VN')} đ</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                      <button onClick={() => openEditModal(item)} className="text-blue-500 hover:text-blue-700">Sửa</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">Xóa</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-4">Chưa có sản phẩm nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadProducts}
        productToEdit={selectedProduct}
      />
    </div>
  );
}