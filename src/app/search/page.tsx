// src/app/search/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import type { Flight } from '@/types/database';
import Navbar from '@/components/NavBar';
import {
    FlightStatus

} from '@/components/FlightStatus';
export default function SearchPage() {
    const router = useRouter();
    const { session, user } = useAuth();

    useEffect(() => {
        if (!session) router.replace('/login');
    }, [session, router]);

    const [airports, setAirports] = useState<{ id: string; iata_code: string; city: string }[]>([]);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departDate, setDepartDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [cabin, setCabin] = useState<'Economy' | 'Business' | 'First'>('Economy');
    const [passengers, setPassengers] = useState(1);

    const [outbound, setOutbound] = useState<Flight[]>([]);
    const [inbound, setInbound] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const [selectedOutbound, setSelectedOutbound] = useState<Flight | null>(null);
    const [selectedInbound, setSelectedInbound] = useState<Flight | null>(null);

    // New sort state
    const [outboundSort, setOutboundSort] = useState<'price' | 'departure'>('price');
    const [inboundSort, setInboundSort] = useState<'price' | 'departure'>('price');

    useEffect(() => {
        supabase
            .from('airports')
            .select('id,iata_code,city')
            .then(({ data, error }) => {
                if (!error) setAirports(data!);
            });
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination || !departDate) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);
        setOutbound([]);
        setInbound([]);
        setSelectedOutbound(null);
        setSelectedInbound(null);

        try {
            const params = new URLSearchParams({ origin, destination, date: departDate, cabinClass: cabin, passengers: passengers.toString() });
            if (returnDate) params.set('returnDate', returnDate);

            const res = await fetch(`/api/searchFlights?${params}`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Search failed');
            setOutbound(json.outbound);
            setInbound(json.inbound);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const canBook = !!selectedOutbound && (!returnDate || !!selectedInbound);

    const handleBook = () => {
        if (!selectedOutbound) return;
        if (returnDate && selectedInbound) {
            const params = new URLSearchParams({
                outboundId: selectedOutbound.id,
                returnId: selectedInbound.id,
                cabinClass: cabin,
                passengerCount: passengers.toString(),
            });
            // router.push(`/book/roundTrip?${params}`);
            router.push(`/book/roundTrip/${selectedOutbound.id}/${selectedInbound.id}`);
        } else {
            router.push(`/book/${selectedOutbound.id}`);
        }
    };

    const sortedOutbound = useMemo(
        () =>
            [...outbound].sort((a, b) =>
                outboundSort === 'price'
                    ? a.base_price - b.base_price
                    : new Date(a.departure).getTime() - new Date(b.departure).getTime()
            ),
        [outbound, outboundSort]
    );

    const sortedInbound = useMemo(
        () =>
            [...inbound].sort((a, b) =>
                inboundSort === 'price'
                    ? a.base_price - b.base_price
                    : new Date(a.departure).getTime() - new Date(b.departure).getTime()
            ),
        [inbound, inboundSort]
    );

    return (
        <div className="min-h-screen bg-[#f5f7fa]  ">
            {/* Top bar with profile */}
            <Navbar />
            <div className=" mx-auto px-4 flex flex-col lg:flex-row gap-6">
                {/* Search form (unchanged structure) */}
                <div className="max-w-3xl mx-auto py-6">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Origin */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-800 mb-1">Origin</label>
                            <select
                                required
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                disabled={loading}
                                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00A4D9] text-gray-800"
                            >
                                <option value="" className="text-gray-500">Select Origin</option>
                                {airports.map((a) => (
                                    <option key={a.id} value={a.id} className="text-gray-800">
                                        {a.iata_code} — {a.city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Destination */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-800 mb-1">Destination</label>
                            <select
                                required
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                disabled={loading}
                                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00A4D9] text-gray-800"
                            >
                                <option value="" className="text-gray-500">Select Destination</option>
                                {airports.map((a) => (
                                    <option key={a.id} value={a.id} className="text-gray-800">
                                        {a.iata_code} — {a.city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Departure Date */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-800 mb-1">Departure Date</label>
                            <input
                                type="date"
                                required
                                value={departDate}
                                onChange={(e) => setDepartDate(e.target.value)}
                                disabled={loading}
                                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00A4D9] text-gray-800"
                            />
                        </div>

                        {/* Return Date */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-800 mb-1">Return Date</label>
                            <input
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                disabled={loading}
                                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00A4D9] text-gray-800"
                            />
                        </div>

                        {/* Cabin */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-800 mb-1">Cabin Class</label>
                            <select
                                value={cabin}
                                onChange={(e) => setCabin(e.target.value as any)}
                                disabled={loading}
                                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00A4D9] text-gray-800"
                            >
                                <option value="Economy" className="text-gray-800">Economy</option>
                                <option value="Business" className="text-gray-800">Business</option>
                                <option value="First" className="text-gray-800">First</option>
                            </select>
                        </div>

                        {/* Passengers */}
                        <div className="flex flex-col md:col-span-2">
                            <label className="text-sm font-medium text-gray-800 mb-1">Passengers</label>
                            <input
                                type="number"
                                min={1}
                                value={passengers}
                                onChange={(e) => setPassengers(Number(e.target.value))}
                                disabled={loading}
                                className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-[#00A4D9] text-gray-800"
                            />
                        </div>

                        {/* Search Button */}
                        <div className="flex items-end col-span-1 md:col-span-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#00A4D9] text-white p-2 rounded hover:bg-[#008bb3] transition"
                            >
                                {loading ? 'Searching…' : 'Search'}
                            </button>
                        </div>
                    </form>


                    {error && <p className="text-red-600 mt-4">{error}</p>}

                    {/* —— NEW: Intro / no-search prompt —— */}
                    {!hasSearched && !loading && (
                        <p className="mt-6 text-center text-gray-600">
                            Please select origin, destination, and departure date above, then click “Search”
                        </p>
                    )}

                    {/* —— NEW: No outbound flights on date —— */}
                    {hasSearched && !loading && outbound.length === 0 && (
                        <p className="mt-6 text-center text-gray-600">
                            No outbound flights found for {departDate}.
                        </p>
                    )}

                    {/* Outbound */}
                    {sortedOutbound.length > 0 && (
                        <section className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-semibold text-gray-800">Outbound Flights</h2>
                                <select
                                    value={outboundSort}
                                    onChange={(e) => setOutboundSort(e.target.value as any)}
                                    className="border border-gray-300 p-1 rounded focus:ring-2 focus:ring-[#00A4D9]"
                                >
                                    <option value="price">Price</option>
                                    <option value="departure">Departure time</option>
                                </select>
                            </div>
                            <ul className="space-y-2">
                                {sortedOutbound.map((f) => (
                                    <li
                                        key={f.id}
                                        onClick={() => setSelectedOutbound(f)}
                                        className={`p-4 border rounded cursor-pointer ${selectedOutbound?.id === f.id ? 'bg-blue-50 ring-2 ring-[#00A4D9]' : ''
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {f.flight_no} –{' '}
                                                    {new Date(f.departure).toLocaleTimeString()} →{' '}
                                                    {new Date(f.arrival).toLocaleTimeString()}
                                                </p>
                                                <p className="text-sm text-gray-600">Price: ₹{f.base_price}</p>
                                            </div>
                                            <button className="bg-[#002652] text-white px-4 py-1 rounded hover:bg-[#01497c] transition">
                                                Select →
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {hasSearched && returnDate && !loading && inbound.length === 0 && (
                        <p className="mt-6 text-center text-gray-600">
                            No return flights found for {returnDate}.
                        </p>
                    )}

                    {/* Inbound */}
                    {returnDate && sortedInbound.length > 0 && (
                        <section className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-semibold text-gray-800">Return Flights</h2>
                                <select
                                    value={inboundSort}
                                    onChange={(e) => setInboundSort(e.target.value as any)}
                                    className="border border-gray-300 p-1 rounded focus:ring-2 focus:ring-[#00A4D9]"
                                >
                                    <option value="price">Price</option>
                                    <option value="departure">Departure time</option>
                                </select>
                            </div>
                            <ul className="space-y-2">
                                {sortedInbound.map((f) => (
                                    <li
                                        key={f.id}
                                        onClick={() => setSelectedInbound(f)}
                                        className={`p-4 border rounded cursor-pointer ${selectedInbound?.id === f.id ? 'bg-blue-50 ring-2 ring-[#00A4D9]' : ''
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {f.flight_no} –{' '}
                                                    {new Date(f.departure).toLocaleTimeString()} →{' '}
                                                    {new Date(f.arrival).toLocaleTimeString()}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Price: ₹{f.base_price} | Seats:{' '}
                                                    {f.seats?.find((s) => s.seat_class === cabin)?.available ?? 0}
                                                </p>
                                            </div>
                                            <button className="bg-[#002652] text-white px-4 py-1 rounded hover:bg-[#01497c] transition">
                                                Select →
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Book button */}
                    {canBook && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleBook}
                                className="bg-[#00A4D9] text-white px-8 py-3 rounded hover:bg-[#008bb3] transition"
                            >
                                {returnDate ? 'Book Round Trip' : 'Book Flight'}
                            </button>
                        </div>
                    )}
                </div>
                <aside className="w-full lg:w-1/3">
                    <FlightStatus />
                </aside>

            </div>


        </div>
    );
}
