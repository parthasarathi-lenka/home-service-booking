import { getServices, getCustomerBookings } from '@/app/actions';
import BookingForm from '@/components/BookingForm';
import ReviewForm from '@/components/ReviewForm';
import { CalendarClock } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default async function CustomerHub({ userId, bookServiceId }: { userId: number; bookServiceId?: number }) {
  const [services, myBookings] = await Promise.all([getServices(), getCustomerBookings(userId)]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <BookingForm services={services} defaultServiceId={bookServiceId} />
      </div>
      <div className="lg:col-span-2 space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2"><CalendarClock size={20} /> My Bookings</h2>
        {myBookings.length === 0 && <p className="text-slate-400 text-sm">No bookings yet — book a service to get started.</p>}
        {myBookings.map((b: any) => (
          <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{b.service?.name}</h3>
                <p className="text-xs text-slate-500">{b.date} · {b.timeSlot} · {b.paymentType === 'CASH' ? 'Cash' : 'Online (mock)'}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[b.status]}`}>{b.status}</span>
            </div>
            {b.status === 'COMPLETED' && !b.review?.length && <ReviewForm bookingId={b.id} />}
            {b.status === 'COMPLETED' && b.review?.length > 0 && (
              <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">You rated this {b.review[0].rating}/5 ★</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
