"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';

export default function RegisterPage( ) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const dataToSubmit = {
        fullName: formData.fullName,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
      };

      // --- THIS IS THE CORRECTED URL ---
      await axios.post(`${apiUrl}/api/auth/register/landlord`, dataToSubmit);
      // --------------------------------

      toast.success('Registration successful! Please sign in.');
      router.push('/login');

    } catch (err) {
      console.error("REGISTRATION ERROR:", err);
      const errorMessage = err.response?.data?.message || 'An error occurred during registration.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
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
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Create an account</h2>
            <p className="text-gray-600 mt-2">to get started with Bantus Rental</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">Full Name</label>
              <input id="fullName" name="fullName" type="text" onChange={handleChange} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" onChange={handleChange} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
              <input id="username" name="username" type="text" onChange={handleChange} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" onChange={handleChange} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" onChange={handleChange} className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700" required />
            </div>
            <div className="pt-2">
              <button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-orange-300">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-orange-600 hover:text-orange-800">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
