import { registerUser } from '@/app/actions';
import AuthForm from '@/components/AuthForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-xl p-6 mt-8">
      <h1 className="text-xl font-bold mb-1">Create your account</h1>
      <p className="text-sm text-slate-500 mb-5">Book services or offer them as a provider.</p>
      <AuthForm
        action={registerUser}
        submitLabel="Create Account"
        fields={[
          { name: 'name', label: 'Full Name', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Phone (optional)', type: 'tel' },
          { name: 'password', label: 'Password (6+ characters)', type: 'password' },
          { name: 'role', label: 'I am a', type: 'select', options: ['CUSTOMER', 'PROVIDER'] },
        ]}
      />
      <p className="text-sm text-slate-500 mt-4 text-center">
        Already have an account? <Link href="/login" className="text-indigo-600 font-medium">Log in</Link>
      </p>
    </div>
  );
}
