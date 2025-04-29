'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { IoTrashBin } from 'react-icons/io5';

interface Employee {
  employeeId: number;
  fullname: string;
  telNo: string;
  positionName: string;
}

const itemsPerPage = 5;

export default function DashboardPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [searchBar, setSearchBar] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEmployees = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const response = await axios.get('/api/Employee/GetAllEmployee', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      toast.error('Failed to fetch employees');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/edit/${id}`);
  };

  const handleCreate = () => {
    router.push('/dashboard/create');
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    if (selectedEmployeeId === null) return;
    try {
      await axios.delete('/api/Employee/DeletePosition', {
        params: { id: selectedEmployeeId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      toast.error('Failed to delete employee');
    } finally {
      setOpenConfirmModal(false);
      setSelectedEmployeeId(null);
    }
  };

  /* Popup Delete Modal */
  const onDeleteClick = (id: number) => {
    setSelectedEmployeeId(id);
    setOpenConfirmModal(true);
  };

  /* Search Filter */
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.fullname.toLowerCase().includes(searchBar.toLowerCase()) ||
      emp.telNo.toLowerCase().includes(searchBar.toLowerCase()) ||
      emp.positionName.toLowerCase().includes(searchBar.toLowerCase())
  );

  /* Pagination Control */
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /* Skeleton Loading */
  if (!employees.length) {
    return (
      <div className="flex min-h-screen flex-col gap-10 bg-radial from-[#8e44ad] to-black/90 p-6 text-white">
        {/* Header Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <div className="h-10 w-2/3 animate-pulse rounded bg-gray-300" />
          <div className="h-10 w-28 animate-pulse rounded bg-gray-300" />
        </div>

        {/* Searchbar + Add Button Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:px-2">
          <div className="h-10 w-full animate-pulse rounded-full bg-gray-300 md:w-4/5" />
          <div className="h-10 w-full animate-pulse rounded bg-gray-300 md:w-40" />
        </div>

        {/* List Skeleton For Mobile */}
        <div className="mt-4 flex flex-col gap-4 md:hidden">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-28 animate-pulse rounded-xl bg-gray-300" />
          ))}
        </div>

        {/* Table Skeleton For Desktop */}
        <div className="m-2 hidden flex-col items-center justify-center overflow-x-auto rounded-md md:flex">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-sm tracking-wide text-gray-600 uppercase">
                <th className="p-6 text-left">No</th>
                <th className="p-6 text-left">Full Name</th>
                <th className="p-6 text-left">Telephone</th>
                <th className="p-6 text-left">Position</th>
                <th className="p-6 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-black">
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="p-6">
                    <div className="h-4 w-6 animate-pulse rounded bg-gray-300" />
                  </td>
                  <td className="p-6">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-300" />
                  </td>
                  <td className="p-6">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-300" />
                  </td>
                  <td className="p-6">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-300" />
                  </td>
                  <td className="p-6">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col gap-10 bg-radial from-[#8e44ad] to-black/90 p-6 text-white">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#f6dd41] md:text-5xl">Employee Management</h1>
        <button
          onClick={handleLogout}
          className="rounded bg-yellow-300 px-4 py-2 font-bold text-black transition hover:bg-yellow-200"
        >
          Logout
        </button>
      </header>

      {/* Searchbar and Add */}
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:px-2 md:py-8">
        <input
          type="text"
          placeholder="🔍 Search employee ..."
          value={searchBar}
          onChange={(e) => {
            setSearchBar(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-full border border-purple-500 bg-white p-2 px-4 text-black focus:ring-2 focus:ring-purple-600 focus:outline-none md:w-4/5"
        />
        <button
          onClick={handleCreate}
          className="w-full rounded bg-yellow-300 px-6 py-2 font-bold text-black transition hover:bg-yellow-200 md:w-auto"
        >
          Add Employee
        </button>
      </div>

      {/* Employee List For Mobile */}
      <div className="flex flex-col gap-4 md:hidden">
        {paginatedEmployees.map((emp, index) => (
          <div
            key={emp.employeeId}
            className="rounded-xl bg-white p-4 text-black shadow-md"
            onClick={() => handleEdit(emp.employeeId)}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-bold">{emp.fullname}</h2>
              <span className="text-sm text-gray-500">
                #{(currentPage - 1) * itemsPerPage + index + 1}
              </span>
            </div>
            <p className="mb-1 text-sm">
              <strong>Telephone:</strong> {emp.telNo || '-'}
            </p>
            <p className="mb-4 text-sm">
              <strong>Position:</strong> {emp.positionName}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(emp.employeeId);
                }}
                className="text-red-500"
              >
                <IoTrashBin />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table For Desktop */}
      <div className="m-2 hidden flex-col items-center justify-center overflow-x-auto rounded-xl bg-white shadow-md md:flex md:overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-sm tracking-wide text-gray-600 uppercase">
              <th className="p-6 text-left">No</th>
              <th className="p-6 text-left">Full Name</th>
              <th className="p-6 text-left">Telephone</th>
              <th className="p-6 text-left">Position</th>
              <th className="p-6 text-left"></th>
            </tr>
          </thead>
          <tbody className="text-md divide-y divide-gray-200 text-black">
            {paginatedEmployees.map((emp, index) => (
              <tr
                key={emp.employeeId}
                onClick={() => handleEdit(emp.employeeId)}
                className="cursor-pointer transition-colors hover:bg-gray-200 hover:text-black"
              >
                <td className="p-6">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="p-6 font-medium">{emp.fullname}</td>
                <td className="p-6">{emp.telNo || '-'}</td>
                <td className="p-6">{emp.positionName}</td>
                <td className="flex justify-end gap-4 p-6" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onDeleteClick(emp.employeeId)}
                    className="cursor-pointer text-red-500 hover:underline"
                  >
                    <IoTrashBin />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {/* Prev Button */}
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={`rounded px-3 py-1 ${
              currentPage === 1
                ? 'cursor-not-allowed bg-gray-400 text-white'
                : 'bg-white text-black hover:bg-yellow-200'
            }`}
          >
            Prev
          </button>

          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`rounded px-3 py-1 ${
                currentPage === page
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={`rounded px-3 py-1 ${
              currentPage === totalPages
                ? 'cursor-not-allowed bg-gray-400 text-white'
                : 'bg-white text-black hover:bg-yellow-200'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {openConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-80 rounded-lg bg-white p-6 text-center text-black shadow-lg">
            <h2 className="mb-4 text-lg font-semibold">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this employee?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setOpenConfirmModal(false)}
                className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
