'use client';

import { useTransition } from 'react';
import { manageBookingStatus } from '@/app/actions';

export default function StatusButtons({ bookingId, status }: { bookingId: number; status: string }) {
  const [pending, startTransition] = useTransition();

  function update(next: 'CONFIRMED' | 'REJECTED' | 'COMPLETED') {
    startTransition(async () => {
      await manageBookingStatus(bookingId, next);
    });
  }

  if (status === 'PENDING') {
    return (
      <div className="flex gap-2">
        <button disabled={pending} onClick={() => update('CONFIRMED')} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 disabled:opacity-60">Accept</button>
        <button disabled={pending} onClick={() => update('REJECTED')} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 disabled:opacity-60">Reject</button>
      </div>
    );
  }
  if (status === 'CONFIRMED') {
    return (
      <button disabled={pending} onClick={() => update('COMPLETED')} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-60">Mark Completed</button>
    );
  }
  return null;
}
