"use client";

import { useEffect, useState } from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { fetchAPI } from "@/lib/api";
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [loading, setLoading] = useState(true);

  const loadUsers = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetchAPI(`/users?page=${page}&limit=${limit}`);
      if (res.success) {
        setUsers(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error("Lỗi fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(currentPage);
  }, [currentPage]);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!confirm(`Bạn muốn đổi quyền user này thành ${newRole}?`)) return;
    
    try {
      await fetchAPI(`/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole }),
      });
      loadUsers(currentPage);
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleDisable = async (userId: string) => {
    if (!confirm("Bạn có chắc muốn vô hiệu hóa người dùng này?")) return;
    
    try {
      await fetchAPI(`/users/${userId}/disable`, {
        method: 'PATCH',
      });
      loadUsers(currentPage);
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <PageBreadCrumb pageTitle="Quản lý Người Dùng" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
          Danh sách Người dùng
        </h3>

        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="bg-gray-50 uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Thông tin</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Trạng thái</th>
                    <th className="px-6 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
                      <td className="px-6 py-4 truncate max-w-[80px]" title={user.id}>{user.id}</td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.status === 'DISABLE' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {user.status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <button 
                          onClick={() => handleRoleChange(user.id, user.role)}
                          className="text-blue-500 hover:text-blue-700"
                          disabled={user.status === 'DISABLE'}
                        >
                          Đổi Role
                        </button>
                        {user.status !== 'DISABLE' && (
                          <button 
                            onClick={() => handleDisable(user.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Khóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8">Chưa có người dùng nào.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 0 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Hiển thị trang <span className="font-semibold text-gray-900 dark:text-white">{pagination.currentPage}</span> / {pagination.totalPages} 
                  <span className="ml-2 hidden sm:inline">(Tổng {pagination.totalItems} người dùng)</span>
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