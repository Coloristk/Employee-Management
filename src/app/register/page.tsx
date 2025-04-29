'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();

  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/UserManagement/create-user', {
        fullname,
        username,
        password,
        email,
        role: 'user',
      });

      toast.success('User registered successfully!');
      router.push('/login');
    } catch (error) {
      toast.error('Failed to register user!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-[#8e44ad] to-black">
      <div className="w-full max-w-sm rounded bg-white p-8 text-center shadow-md">
        <h1 className="mb-10 text-4xl font-bold text-black">Register</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          {/* Fullname */}
          <div className="flex w-full flex-col items-start">
            <label htmlFor="fullname" className="text-md font-medium text-gray-600">
              Fullname
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Fullname"
              required
              autoComplete="off"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full rounded-sm border-2 p-2"
            />
          </div>

          {/* Username */}
          <div className="flex w-full flex-col items-start">
            <label htmlFor="username" className="text-md font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              required
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-sm border-2 p-2"
            />
          </div>

          {/* Password */}
          <div className="flex w-full flex-col items-start">
            <label htmlFor="password" className="text-md font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border-2 p-2"
            />
          </div>

          {/* Email */}
          <div className="flex w-full flex-col items-start">
            <label htmlFor="email" className="text-md font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border-2 p-2"
            />
          </div>

          <button
            type="submit"
            className="text-md my-4 w-full rounded-sm bg-[#8e44ad] p-3 font-medium text-white transition duration-300 ease-in-out hover:bg-[#93268c]"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
