'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RoundTripBook() {
    const { session } = useAuth();
    const router = useRouter();
    const { outboundId, returnId } = useParams() as {
        outboundId: string;
        returnId: string;
    };

    const [cabin, setCabin] = useState<'Economy' | 'Business' | 'First'>('Economy');
    const [passengers, setPassengers] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/createRoundTrip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({ outboundId, returnId, cabinClass: cabin, passengerCount: passengers }),
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
                    <h1 className="text-2xl font-bold text-[#002652]">Round Trip Booked!</h1>

                    <div className="space-y-2">
                        <div>
                            <h2 className="font-semibold text-gray-800">Outbound</h2>
                            <p className='text-gray-800'>ID: {result.outbound.booking.id}</p>
                            <a
                                href={result.outbound.ticketUrl}
                                target="_blank"
                                className="text-[#00A4D9] underline"
                            >
                                Download
                            </a>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800">Return</h2>
                            <p className='text-gray-800'>ID: {result.inbound.booking.id}</p>
                            <a
                                href={result.inbound.ticketUrl}
                                target="_blank"
                                className="text-[#00A4D9] underline"
                            >
                                Download
                            </a>
                        </div>
                    </div>

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
                <h1 className="text-2xl font-bold text-[#002652]">Book Round Trip</h1>
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
                            <option>Business</option>
                            <option>First</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Passengers</label>
                        <input
                            type="number"
                            min={1}
                            value={passengers}
                            onChange={(e) => setPassengers(+e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A4D9]"
                            disabled={loading}
                        />
                    </div>

                    {error && <p className="text-red-600">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00A4D9] text-white py-2 rounded hover:bg-[#008bb3] transition"
                    >
                        {loading ? 'Booking…' : 'Confirm Round Trip'}
                    </button>
                </form>
            </div>
        </div>
    );
}
