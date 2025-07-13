'use client';

import React from 'react';
import { Booking } from '@/types/database';

type Props = {
  booking: Booking;
  onModify: (id: string) => void;
  onCancel: (id: string) => void;
};

export default function BookingCard({ booking, onModify, onCancel }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all flex flex-col lg:flex-row justify-between gap-6">
      {/* Left side – Booking details */}
      <div className="flex-1 space-y-1">
        <p className="text-gray-900">
          <strong>Booking ID:</strong> {booking.id}
        </p>
        <p className="text-gray-900">
          <strong>Flight:</strong> {booking.flights.flight_no}
        </p>
        <p className="text-gray-900">
          <strong>Date:</strong> {new Date(booking.flights.departure).toLocaleDateString()}
        </p>
        <p className={`font-semibold ${booking.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}`}>
          <strong>Status:</strong> {booking.status}
        </p>
        {booking.cancelled_at && (
          <p className="text-gray-500 italic">
            Cancelled at {new Date(booking.cancelled_at).toLocaleString()}
          </p>
        )}
        <p className="text-gray-900">
          <strong>Passengers:</strong> {booking.passenger_count}
        </p>
        <p className="text-gray-900">
          <strong>Total Paid:</strong> ₹{booking.total_price.toFixed(2)}
        </p>
      </div>

      {/* Right side – Actions */}
      <div className="flex flex-col items-start lg:items-end justify-center gap-3 min-w-[150px]">
        {booking.ticketUrl && (
          <a
            href={booking.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00A4D9] underline font-medium"
          >
            Download Ticket
          </a>
        )}
        {booking.status !== 'cancelled' && (
          <>
            <button
              onClick={() => onModify(booking.id)}
              className="bg-[#00A4D9] text-white px-4 py-1.5 rounded-md hover:bg-[#008bb3] transition w-full"
            >
              Modify
            </button>
            <button
              onClick={() => onCancel(booking.id)}
              className="bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 transition w-full"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
