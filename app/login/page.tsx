import { loginUser } from '@/app/actions';
import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-xl p-6 mt-8">
      <h1 className="text-xl font-bold mb-1">Welcome back</h1>
      <p className="text-sm text-slate-500 mb-5">Log in to manage your bookings.</p>
      <AuthForm
        action={loginUser}
        submitLabel="Log In"
        fields={[
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'password', label: 'Password', type: 'password' },
        ]}
      />
      <p className="text-sm text-slate-500 mt-4 text-center">
        No account? <Link href="/register" className="text-indigo-600 font-medium">Sign up</Link>
      </p>
      <div className="mt-5 text-xs text-slate-400 bg-slate-50 rounded-lg p-3">
        Demo: customer@test.com / provider@test.com / admin@test.com — password: password123
      </div>
    </div>
  );
}
