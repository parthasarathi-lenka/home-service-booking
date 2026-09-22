'use server';

import { db } from '@/db';
import { users, bookings, reviews, services } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { setSession, clearSession, getSession } from '@/lib/session';

// ---------- AUTH ----------

export async function registerUser(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const role = String(formData.get('role') || 'CUSTOMER') as 'CUSTOMER' | 'PROVIDER';
  const phone = String(formData.get('phone') || '');

  if (!name || !email || password.length < 6) {
    throw new Error('Name, valid email, and a password of 6+ characters are required.');
  }

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) {
    throw new Error('An account with this email already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db.insert(users).values({
    name, email, passwordHash, role: role === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER', phone,
  }).returning();

  setSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  redirect('/dashboard');
}

export async function loginUser(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) throw new Error('Invalid email or password.');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid email or password.');

  setSession({ id: user.id, name: user.name, email: user.email, role: user.role });
  redirect('/dashboard');
}

export async function logoutUser() {
  clearSession();
  redirect('/login');
}

// ---------- BOOKINGS ----------

export async function createBooking(formData: FormData) {
  const session = getSession();
  if (!session) throw new Error('You must be logged in to book a service.');

  const serviceId = Number(formData.get('serviceId'));
  const date = String(formData.get('date') || '');
  const timeSlot = String(formData.get('timeSlot') || '');
  const paymentType = String(formData.get('paymentType') || 'CASH') as 'CASH' | 'MOCK_ONLINE';
  const address = String(formData.get('address') || '');

  if (!serviceId || !date || !timeSlot) {
    throw new Error('Service, date, and time slot are required.');
  }

  const [service] = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
  if (!service) throw new Error('Service not found.');

  await db.insert(bookings).values({
    customerId: session.id,
    providerId: service.providerId,
    serviceId,
    date,
    timeSlot,
    paymentType,
    address,
    status: 'PENDING',
  });

  revalidatePath('/dashboard');
}

export async function manageBookingStatus(bookingId: number, status: 'CONFIRMED' | 'REJECTED' | 'COMPLETED') {
  const session = getSession();
  if (!session || (session.role !== 'PROVIDER' && session.role !== 'ADMIN')) {
    throw new Error('Only providers or admins can update booking status.');
  }

  const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  if (!booking) throw new Error('Booking not found.');
  if (session.role === 'PROVIDER' && booking.providerId !== session.id) {
    throw new Error('You can only manage your own bookings.');
  }

  await db.update(bookings).set({ status }).where(eq(bookings.id, bookingId));
  revalidatePath('/dashboard');
}

// ---------- REVIEWS ----------

export async function submitReview(formData: FormData) {
  const session = getSession();
  if (!session) throw new Error('You must be logged in to leave a review.');

  const bookingId = Number(formData.get('bookingId'));
  const rating = Number(formData.get('rating'));
  const comment = String(formData.get('comment') || '');

  if (!bookingId || rating < 1 || rating > 5) {
    throw new Error('A valid booking and a rating between 1 and 5 are required.');
  }

  const [booking] = await db.select().from(bookings).where(
    and(eq(bookings.id, bookingId), eq(bookings.customerId, session.id))
  ).limit(1);

  if (!booking) throw new Error('Booking not found.');
  if (booking.status !== 'COMPLETED') throw new Error('You can only review completed bookings.');

  await db.insert(reviews).values({ bookingId, customerId: session.id, rating, comment });
  revalidatePath('/dashboard');
}

// ---------- READ HELPERS ----------

export async function getServices(category?: string) {
  if (category && category !== 'all') {
    return db.select().from(services).where(eq(services.category, category));
  }
  return db.select().from(services);
}

export async function getCustomerBookings(customerId: number) {
  return db.query.bookings.findMany({
    where: eq(bookings.customerId, customerId),
    with: { service: true, provider: true, review: true },
    orderBy: (b, { desc }) => [desc(b.createdAt)],
  });
}

export async function getProviderBookings(providerId: number) {
  return db.query.bookings.findMany({
    where: eq(bookings.providerId, providerId),
    with: { service: true, customer: true },
    orderBy: (b, { desc }) => [desc(b.createdAt)],
  });
}
