import { getServices } from '@/app/actions';
import { getSession } from '@/lib/session';
import Link from 'next/link';
import { Wrench, Sparkles, Zap, Droplet } from 'lucide-react';

const ICONS: Record<string, any> = {
  Cleaning: Sparkles,
  'Appliance Repair': Wrench,
  Electrical: Zap,
  Plumbing: Droplet,
};

export default async function HomePage({ searchParams }: { searchParams: { category?: string } }) {
  const session = getSession();
  const category = searchParams.category || 'all';
  const allServices = await getServices(category);
  const categories = ['all', 'Cleaning', 'Appliance Repair', 'Electrical', 'Plumbing'];

  return (
    <div>
      <section className="text-center py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Trusted home services, booked in minutes</h1>
        <p className="text-slate-500 mt-3 max-w-xl mx-auto">Cleaning, repairs, electrical, and plumbing — vetted providers, transparent pricing.</p>
      </section>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((c) => (
          <Link
            key={c}
            href={c === 'all' ? '/' : `/?category=${encodeURIComponent(c)}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              category === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {c === 'all' ? 'All Services' : c}
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allServices.map((s) => {
          const Icon = ICONS[s.category] || Wrench;
          return (
            <div key={s.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg"><Icon size={22} /></div>
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <span className="text-xs text-slate-400">{s.category}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 flex-1">{s.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-bold text-indigo-600">${s.price}</span>
                {session ? (
                  <Link href={`/dashboard?book=${s.id}`} className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700">
                    Book Now
                  </Link>
                ) : (
                  <Link href="/login" className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700">
                    Login to Book
                  </Link>
                )}
              </div>
            </div>
          );
        })}
        {allServices.length === 0 && (
          <p className="text-slate-400 col-span-full text-center py-10">No services found in this category yet.</p>
        )}
      </div>
    </div>
  );
}
