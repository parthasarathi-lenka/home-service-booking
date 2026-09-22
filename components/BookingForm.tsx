'use client';

import { useState, useTransition } from 'react';
import { createBooking } from '@/app/actions';

const SLOTS = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];

export default function BookingForm({ services, defaultServiceId }: { services: { id: number; name: string; price: string }[]; defaultServiceId?: number }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await createBooking(formData);
        setSuccess(true);
      } catch (e: any) {
        setError(e?.message || 'Could not create booking.');
      }
    });
  }

  return (
    <form action={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
      <h3 className="font-semibold">Book a Service</h3>
      <select name="serviceId" defaultValue={defaultServiceId} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
        <option value="">Select a service…</option>
        {services.map((s) => <option key={s.id} value={s.id}>{s.name} — ${s.price}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3">
        <input type="date" name="date" required min={new Date().toISOString().split('T')[0]} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
        <select name="timeSlot" required className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
          <option value="">Time slot…</option>
          {SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <input name="address" placeholder="Service address" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
      <select name="paymentType" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
        <option value="CASH">Cash on Service</option>
        <option value="MOCK_ONLINE">Pay Online (Mock)</option>
      </select>
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Booking request sent!</p>}
      <button type="submit" disabled={pending} className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-60">
        {pending ? 'Booking…' : 'Confirm Booking'}
      </button>
    </form>
  );
}
