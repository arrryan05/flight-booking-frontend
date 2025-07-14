'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    updateProfile,
  } = useProfile(user);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  // sync form state once profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  // if (profileLoading) return <p className="p-6">Loading profile…</p>;
  // if (profileError) return <p className="p-6 text-red-600">Error: {profileError.message}</p>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const { error } = await updateProfile({ full_name: fullName, phone });
    if (error) {
      setMessage(`Update failed: ${error.message}`);
    } else {
      setMessage('Profile updated!');
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Top nav */}
      <NavBar/>

      <div className="flex max-w-6xl mx-auto mt-8 px-4">
        {/* Sidebar */}
        <aside className="w-64 bg-white rounded-lg shadow p-6 flex flex-col justify-between">
          <div>
            {/* avatar */}
            <div className="w-16 h-16 rounded-full bg-[#00A4D9] flex items-center justify-center text-white text-2xl mb-4">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold text-[#002652] mb-1">Hi there!</h2>
            <p className="text-sm text-gray-600 mb-6">{user?.email}</p>

            {/* links */}
            <ul className="space-y-4">
              <li>
                <Link href="/bookings" className="flex items-center text-gray-800 hover:text-[#00A4D9]">
                  <span className="mr-2">📄</span> Your bookings
                </Link>
              </li>
              <li>
                <Link href="/profile" className="flex items-center text-gray-800 font-medium">
                  <span className="mr-2">⚙️</span> Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Log out button now redirects */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
          >
            Log out
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-8 bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-[#002652] mb-6">Account</h1>

          {/* General info */}
          <section className="mb-8">
            <div className="bg-[#f0f4f8] px-4 py-2 rounded-t">
              <h2 className="font-semibold text-[#002652]">General info</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Full name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A4D9]"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A4D9]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-[#00A4D9] text-white px-6 py-2 rounded-lg hover:bg-[#008bb3] transition"
              >
                Save
              </button>
              {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
