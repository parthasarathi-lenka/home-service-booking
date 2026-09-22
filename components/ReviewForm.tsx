'use client';

import { useState, useTransition } from 'react';
import { submitReview } from '@/app/actions';
import { Star } from 'lucide-react';

export default function ReviewForm({ bookingId }: { bookingId: number }) {
  const [rating, setRating] = useState(5);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await submitReview(formData);
        setDone(true);
      } catch (e: any) {
        setError(e?.message || 'Could not submit review.');
      }
    });
  }

  if (done) return <p className="text-xs text-green-700 mt-2">Thanks for your review!</p>;

  return (
    <form action={handleSubmit} className="mt-3 pt-3 border-t border-slate-100 space-y-2">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="rating" value={rating} />
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}>
            <Star size={18} className={n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
          </button>
        ))}
      </div>
      <textarea name="comment" placeholder="Leave a comment…" rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button type="submit" disabled={pending} className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 disabled:opacity-60">
        {pending ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}
