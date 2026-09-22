import type { Metadata } from 'next';
import './globals.css';
import { getSession } from '@/lib/session';
import { logoutUser } from '@/app/actions';
import Link from 'next/link';
import { Home, LogOut } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HomeServe — Book Trusted Home Services',
  description: 'Book cleaning, repairs, electrical, and plumbing services near you.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const session = getSession();

  return (
    <html lang="en">
      <body className="min-h-screen text-slate-900">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-indigo-600">
              <Home size={22} /> HomeServe
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              {session ? (
                <>
                  <span className="text-slate-500 hidden sm:inline">Hi, {session.name} ({session.role})</span>
                  <Link href="/dashboard" className="font-medium hover:text-indigo-600">Dashboard</Link>
                  <form action={logoutUser}>
                    <button className="flex items-center gap-1 text-red-600 font-medium hover:text-red-700">
                      <LogOut size={16} /> Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="font-medium hover:text-indigo-600">Login</Link>
                  <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
