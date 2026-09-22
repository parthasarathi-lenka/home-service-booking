import { getProviderBookings } from '@/app/actions';
import StatusButtons from '@/components/StatusButtons';
import { ClipboardList } from 'lucide-react';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-green-50 text-green-700 border-green-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
};

export default async function ProviderBoard({ userId }: { userId: number }) {
  const jobs = await getProviderBookings(userId);
  const pending = jobs.filter((j: any) => j.status === 'PENDING');
  const active = jobs.filter((j: any) => j.status !== 'PENDING');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-3"><ClipboardList size={20} /> New Requests ({pending.length})</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {pending.length === 0 && <p className="text-slate-400 text-sm">No pending requests right now.</p>}
          {pending.map((b: any) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold">{b.service?.name}</h3>
              <p className="text-xs text-slate-500">Customer: {b.customer?.name} · {b.customer?.phone || 'no phone'}</p>
              <p className="text-xs text-slate-500">{b.date} · {b.timeSlot}</p>
              <p className="text-xs text-slate-500">{b.address}</p>
              <StatusButtons bookingId={b.id} status={b.status} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-3">Job History</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {active.map((b: any) => (
            <div key={b.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{b.service?.name}</h3>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[b.status]}`}>{b.status}</span>
              </div>
              <p className="text-xs text-slate-500">Customer: {b.customer?.name}</p>
              <p className="text-xs text-slate-500">{b.date} · {b.timeSlot}</p>
              <StatusButtons bookingId={b.id} status={b.status} />
            </div>
          ))}
          {active.length === 0 && <p className="text-slate-400 text-sm">No job history yet.</p>}
        </div>
      </div>
    </div>
  );
}
