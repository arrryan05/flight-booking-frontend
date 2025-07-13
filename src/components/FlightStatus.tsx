'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Flight } from '@/types/database';

export function FlightStatus() {
  const [statuses, setStatuses] = useState<Record<string, Flight>>({});

  useEffect(() => {
    const subscription = supabase
      .channel('public:flights')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'flights' },
        (payload) => {
          const f = payload.new as Flight;
          setStatuses((prev) => ({ ...prev, [f.id]: f }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const flightList = Object.values(statuses);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-[#002652] mb-4">
        Live Flight Status
      </h2>

      {flightList.length === 0 ? (
        <p className="text-gray-600">No updates yet.</p>
      ) : (
        <ul className="space-y-3">
          {flightList.map((f) => (
            <li
              key={f.id}
              className="flex justify-between items-center border rounded-lg p-4 bg-white shadow-sm"
            >
              <span className="font-semibold text-gray-800">{f.flight_no}</span>
              <span
                className={
                  f.status === 'on-time'
                    ? 'text-green-600 font-semibold'
                    : f.status === 'delayed'
                    ? 'text-yellow-600 font-semibold'
                    : f.status === 'cancelled'
                    ? 'text-red-600 font-semibold'
                    : 'text-gray-800 font-semibold'
                }
              >
                {f.status.replace(/-/g, ' ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
