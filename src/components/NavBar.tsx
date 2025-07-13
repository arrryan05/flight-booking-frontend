// src/components/NavBar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function NavBar() {
  const { user } = useAuth();

  return (
    <div className="w-full bg-[#f5f7fa]">
      <div className=" mx-auto ">
        <header className="bg-[#002652] text-white flex items-center justify-between px-6 py-4  ">
          <Link href="/search">
            <h1 className="text-2xl font-bold cursor-pointer">SkySearch</h1>
          </Link>
          <Link href="/profile">
            <div className="w-9 h-9 rounded-full bg-[#00A4D9] flex items-center justify-center uppercase font-semibold">
              {user?.email?.[0] || 'U'}
            </div>
          </Link>
        </header>
      </div>
    </div>
  );
}
