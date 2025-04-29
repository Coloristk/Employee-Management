'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Employee {
  employeeId: number;
  fullname: string;
  telNo: string;
  positionName: string;
  positionId: number;
}

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [fullname, setFullname] = useState('');
  const [telNo, setTelNo] = useState('');
  const [positionId, setPositionId] = useState<number>();
  const [positions, setPositions] = useState<{ positionId: number; positionName: string }[]>([]);

  const fetchEmployee = async () => {
    const token = localStorage.getItem('token');
    if (!id || !token) {
      router.push('/login');
      return;
    }

    try {
      const response = await axios.get('/api/Employee/GetEmployeeById', {
        params: { id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployee(response.data);
      setFullname(response.data.fullname);
      setTelNo(response.data.telNo || '');
      setPositionId(response.data.positionId);
    } catch (error) {}
  };

  const fetchPositions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await axios.get('/api/AllMaster/GetAllPosition', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPositions(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmployee();
    fetchPositions();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !positionId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await axios.put(
        '/api/Employee/UpdateEmployee',
        {
          employeeId: Number(id),
          fullname,
          telNo,
          positionId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { id },
        }
      );

      toast.success('Employee updated successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to update employee');
    }
  };

  /* Skeleton Loading */
  if (!employee) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-radial from-[#8e44ad] to-black text-white">
        <div className="mx-auto w-7/8 max-w-xl rounded bg-white p-6 text-black shadow-md">
          <div className="mb-6 h-10 w-2/3 animate-pulse rounded bg-gray-300" />

          {/* Form Skeleton */}
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx}>
                <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-300" />
                <div className="h-10 w-full animate-pulse rounded bg-gray-300" />
              </div>
            ))}

            {/* Button Skeleton */}
            <div className="mt-6 flex gap-4">
              <div className="h-10 w-24 animate-pulse rounded bg-gray-300" />
              <div className="h-10 w-24 animate-pulse rounded bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-[#8e44ad] to-black text-white">
      <div className="mx-auto w-7/8 max-w-xl rounded bg-white p-6 text-black shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Edit Employee</h1>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Fullname</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Telephone</label>
            <input
              type="text"
              value={telNo}
              onChange={(e) => setTelNo(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Position</label>
            <select
              value={positionId}
              onChange={(e) => setPositionId(Number(e.target.value))}
              required
              className="w-full rounded border p-2"
            >
              <option value="" disabled hidden>
                Select Position
              </option>
              {positions.map((pos) => (
                <option key={pos.positionId} value={pos.positionId}>
                  {pos.positionName}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
