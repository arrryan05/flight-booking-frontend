'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { session } = useAuth();

  const handleClick = () => {
    if (session) {
      router.push('/search');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#f5f7fa] px-4">
      <h1 className="text-4xl font-bold mb-6 text-[#002652]">
        Millions of cheap flights. One simple search.
      </h1>
      <button
        onClick={handleClick}
        className="bg-[#00A4D9] text-white px-6 py-3 rounded-lg hover:bg-[#008bb3] transition"
      >
        Search Flights
      </button>
    </div>
  );
}
