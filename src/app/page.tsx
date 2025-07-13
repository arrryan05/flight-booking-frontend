// 'use client';

// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';

// export default function Home() {
//   const router = useRouter();
//   const { session } = useAuth();

//   const handleClick = () => {
//     if (session) {
//       router.push('/search');
//     } else {
//       router.push('/login');
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-[#f5f7fa] px-4">
//       <h1 className="text-4xl font-bold mb-6 text-[#002652]">
//         Millions of cheap flights. One simple search.
//       </h1>
//       <button
//         onClick={handleClick}
//         className="bg-[#00A4D9] text-white px-6 py-3 rounded-lg hover:bg-[#008bb3] transition"
//       >
//         Search Flights
//       </button>
//     </div>
//   );
// }


// src/app/page.tsx
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div
        className="relative h-[70vh] bg-gradient-to-r from-[#002652] to-[#00A4D9] flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Find the Best Flight Deals</h1>
          <p className="mb-8 text-lg max-w-2xl">
            Compare hundreds of airlines to get you where you want to go for less.
          </p>

          {/* Inline Search Form */}
          <button
            onClick={handleClick}
            className="bg-[#00A4D9] text-white px-6 py-3 rounded-lg hover:bg-[#008bb3] transition"
          >
            Search Flights
          </button>

        </div>
      </div>

      {/* Features */}
      <section className="py-16 bg-[#f5f7fa] px-4">
        <h2 className="text-3xl font-bold text-center text-[#002652] mb-8">
          Why SkySearch?
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-[#002652]">Price Alerts</h3>
            <p className="text-gray-700">
              Get notified when prices drop on your favorite routes.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-[#002652]">Flexible Dates</h3>
            <p className="text-gray-700">
              See the cheapest days to fly within your date range.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-[#002652]">Multiple Airlines</h3>
            <p className="text-gray-700">
              Compare hundreds of airlines to find the best deal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
