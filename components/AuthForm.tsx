'use client';

import { useState, useTransition } from 'react';

export default function AuthForm({
  action,
  fields,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: { name: string; label: string; type: string; options?: string[] }[];
  submitLabel: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await action(formData);
      } catch (e: any) {
        // NEXT_REDIRECT errors are thrown by redirect() on success — ignore them.
        if (e?.digest?.startsWith?.('NEXT_REDIRECT')) throw e;
        setError(e?.message || 'Something went wrong. Please try again.');
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name}>
          <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
          {f.type === 'select' ? (
            <select name={f.name} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
              {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : (
            <input
              name={f.name}
              type={f.type}
              required={f.type !== 'tel'}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          )}
        </div>
      ))}
      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
      >
        {pending ? 'Please wait…' : submitLabel}
      </button>
    </form>
  );
}
