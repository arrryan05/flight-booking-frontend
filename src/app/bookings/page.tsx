'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FlightStatus } from '@/components/FlightStatus';
import { Booking } from '@/types/database';
import Navbar from '@/components/NavBar';
import BookingCard from '@/components/BookingCard';
import toast, { Toaster } from 'react-hot-toast';

export default function BookingsPage() {
  const { session, authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/getMyBookings', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (err: any) {
      toast.error(err.message || 'Could not load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) fetchBookings();
  }, [authLoading]);

  const modify = async (id: string) => {
    const countStr = prompt('New passenger count?');
    if (!countStr) return;
    const newCount = Number(countStr);
    try {
      const res = await fetch('/api/modifyBooking', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ bookingId: id, passengerCount: newCount }),
      });
      if (!res.ok) throw new Error('Modification failed');
      await fetchBookings();
      toast.success('Booking updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Could not modify booking');
    }
  };

  const cancel = async (id: string) => {
    if (!confirm('Really cancel this booking?')) return;
    try {
      const res = await fetch('/api/cancelBooking', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ bookingId: id }),
      });
      if (!res.ok) throw new Error('Cancellation failed');
      await fetchBookings();
      toast.success('Booking cancelled');
    } catch (err: any) {
      toast.error(err.message || 'Could not cancel booking');
    }
  };

//   if (loading) return <p className="text-center py-12">Loading your bookings…</p>;
//   if (bookings.length === 0) return <p className="text-center py-12">No bookings yet.</p>;

  return (
    <div className="min-h-screen bg-[#f5f7fa] ">
      {/* toast container */}
      <Toaster position="top-right" />

      {/* Top Navbar */}
      <Navbar />

      {/* Content Layout */}
      <div className="max-w-7xl mx-2 flex flex-col lg:flex-row gap-6 mt-6">
        {/* Booking List */}
        <div className="flex-1 space-y-10">
          {/* Confirmed Bookings */}
          {bookings.filter(b => b.status !== 'cancelled').length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmed Bookings</h2>
              <div className="space-y-6">
                {bookings
                  .filter(b => b.status !== 'cancelled')
                  .map(b => (
                    <BookingCard key={b.id} booking={b} onModify={modify} onCancel={cancel} />
                  ))}
              </div>
            </div>
          )}

          {/* Cancelled Bookings */}
          {bookings.filter(b => b.status === 'cancelled').length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-4">Cancelled Bookings</h2>
              <div className="space-y-6">
                {bookings
                  .filter(b => b.status === 'cancelled')
                  .map(b => (
                    <BookingCard key={b.id} booking={b} onModify={modify} onCancel={cancel} />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Flight Status Side Panel */}
        <aside className="w-full lg:w-[300px]">
          <FlightStatus />
        </aside>
      </div>
    </div>
  );
}
