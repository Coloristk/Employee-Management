'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('/api/Authentication/login', {
        username,
        password,
      });
      const token = response.data.token;

      if (token) {
        localStorage.setItem('token', token);
        router.push('/dashboard');
      }
      toast.success('Login successful!');
    } catch (error) {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-[#8e44ad] to-black">
      <div className="w-full max-w-sm rounded bg-white p-8 text-center shadow-md">
        <h1 className="mb-10 text-4xl font-bold text-black">LOGIN</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          {/* Username */}
          <div className="flex w-full flex-col items-start">
            <label htmlFor="username" className="text-md font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              alt="input username"
              id="username"
              name="username"
              placeholder="Username"
              required
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-sm border-2 p-2 focus:ring-2 focus:ring-[#8e44ad] focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex w-full flex-col items-start">
            <label htmlFor="password" className="text-md font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              alt="input password"
              id="password"
              name="password"
              placeholder="Password"
              required
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border-2 p-2 focus:ring-2 focus:ring-[#8e44ad] focus:outline-none"
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="w-full text-center text-sm text-red-500">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="text-md mt-2 w-full rounded-sm bg-[#8e44ad] p-3 font-medium text-white transition duration-300 ease-in-out hover:bg-[#93268c]"
          >
            Login
          </button>

          <Link
            href="/register"
            className="text-gray-600 transition hover:text-[#8e44ad] hover:underline"
          >
            Don't have an account?
          </Link>
        </form>
      </div>
    </div>
  );
}
