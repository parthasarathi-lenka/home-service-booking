import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import CustomerHub from '@/components/CustomerHub';
import ProviderBoard from '@/components/ProviderBoard';
import { db } from '@/db';
import { users } from '@/db/schema';

export default async function DashboardPage({ searchParams }: { searchParams: { book?: string } }) {
  const session = getSession();
  if (!session) redirect('/login');

  if (session.role === 'ADMIN') {
    const allUsers = await db.select().from(users);
    return (
      <div>
        <h1 className="text-2xl font-bold mb-5">Admin Panel</h1>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Role</th></tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">
        {session.role === 'PROVIDER' ? 'Provider Board' : 'My Dashboard'}
      </h1>
      {session.role === 'PROVIDER' ? (
        <ProviderBoard userId={session.id} />
      ) : (
        <CustomerHub userId={session.id} bookServiceId={searchParams.book ? Number(searchParams.book) : undefined} />
      )}
    </div>
  );
}
