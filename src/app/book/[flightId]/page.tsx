'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import type { Flight } from '@/types/database';

export default function BookPage() {
  const { user, session, authLoading } = useAuth();
  const router = useRouter();
  const { flightId } = useParams();

  const [flight, setFlight] = useState<Flight | null>(null);
  const [cabin, setCabin] = useState<'Economy' | 'Premium Economy' | 'Business' | 'First'>('Economy');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ booking: any; ticketUrl: string } | null>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login');
  }, [authLoading, user, router]);

  // Load flight
  useEffect(() => {
    if (!flightId) return;
    supabase
      .from('flights')
      .select(`
        *,
        base_price,
        origin:airports!flights_origin_id_fkey (iata_code, city),
        destination:airports!flights_dest_id_fkey (iata_code, city)
      `)
      .eq('id', flightId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setFlight(data!);
      });
  }, [flightId]);

  if (authLoading || !user) {
    return <p className="text-center py-12">Checking authentication…</p>;
  }
  if (!flight) {
    return <p className="text-center py-12">{error || 'Loading flight…'}</p>;
  }

  const total = (flight.base_price * passengers).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/createBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ flightId, cabinClass: cabin, passengerCount: passengers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // **Result view**
  if (result) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] pt-12 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h1>
          <p className='text-gray-800'><strong>Booking ID:</strong> {result.booking.id}</p>
          <p className='text-gray-800'><strong>Passengers:</strong> {result.booking.passenger_count}</p>
          <p className='text-gray-800'><strong>Total Paid:</strong> ₹{result.booking.total_price.toFixed(2)}</p>
          <a
            href={result.ticketUrl}
            target="_blank"
            className="text-[#00A4D9] underline"
          >
            Download E‑Ticket
          </a>
          <Link href="/bookings">
            <button className="w-full bg-[#00A4D9] text-white py-2 rounded hover:bg-[#008bb3] transition">
              View My Bookings
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // **Form view**
  return (
    <div className="min-h-screen bg-[#f5f7fa] pt-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-[#002652]">
          Book Flight: {flight.flight_no}
        </h1>
        <p className="text-gray-800">
          {flight.origin.iata_code} → {flight.destination.iata_code}
        </p>
        <p className="text-gray-800">
          Base Price per passenger: ₹{flight.base_price}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Cabin Class</label>
            <select
              value={cabin}
              onChange={(e) => setCabin(e.target.value as any)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A4D9]"
              disabled={loading}
            >
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
              <option>First</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Number of Passengers</label>
            <input
              type="number"
              min={1}
              max={10}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A4D9]"
              disabled={loading}
            />
          </div>

          <p className="text-lg font-semibold text-gray-800">Total: ₹{total}</p>

          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00A4D9] text-white py-2 rounded hover:bg-[#008bb3] transition"
          >
            {loading ? 'Booking…' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
