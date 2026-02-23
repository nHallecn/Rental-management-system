"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // useAuth() will now work because of the layout.js we added
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // The login function from AuthContext handles the API call and redirect
      await login(username, password);
      toast.success("Login successful! Redirecting...");
      // The redirect is handled inside the login function
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF5EE] p-4">
      <div className="flex max-w-4xl w-full bg-white rounded-lg shadow-2xl overflow-hidden">
        
        <div className="w-1/2 hidden md:flex items-center justify-center p-12 bg-[#FBF5EE]">
          <img src="/bantus-logo-art.svg" alt="Bantus Rental Art" className="max-w-full h-auto" />
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-600 mt-2">Sign in to continue to Bantus Rental</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="bg-red-100 text-red-700 p-3 rounded text-sm text-center">{error}</p>}
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
              <input 
                id="username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                required 
              />
            </div>

            <div>
              <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:bg-orange-300">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold text-orange-600 hover:text-orange-800">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
