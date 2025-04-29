'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function CreateEmployeePage() {
  const router = useRouter();

  const [fullname, setFullname] = useState('');
  const [telNo, setTelNo] = useState('');
  const [positionId, setPositionId] = useState<number | ''>('');
  const [positions, setPositions] = useState<{ positionId: number; positionName: string }[]>([]);

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
    fetchPositions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      await axios.post(
        '/api/Employee/CreateEmployee',
        {
          fullname,
          telNo,
          positionId: Number(positionId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Employee created successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Failed to create employee');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-[#8e44ad] to-black p-6 text-white">
      <div className="w-full max-w-xl rounded bg-white p-6 text-black shadow-md">
        <h1 className="mb-6 text-2xl font-bold">Create Employee</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Fullname */}
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

          {/* Telephone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Telephone</label>
            <input
              type="text"
              value={telNo}
              onChange={(e) => setTelNo(e.target.value)}
              className="w-full rounded border p-2"
            />
          </div>

          {/* Position */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Position</label>
            <select
              value={positionId}
              onChange={(e) => setPositionId(Number(e.target.value))}
              required
              className="w-full rounded border p-2"
            >
              <option value="">Select Position</option>
              {positions.map((pos) => (
                <option key={pos.positionId} value={pos.positionId}>
                  {pos.positionName}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
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
