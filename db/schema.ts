import { pgTable, serial, varchar, text, integer, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['CUSTOMER', 'PROVIDER', 'ADMIN']);
export const bookingStatusEnum = pgEnum('booking_status', ['PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED']);
export const paymentTypeEnum = pgEnum('payment_type', ['CASH', 'MOCK_ONLINE']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 120 }).notNull(),
  email: varchar('email', { length: 160 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: roleEnum('role').notNull().default('CUSTOMER'),
  phone: varchar('phone', { length: 30 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 160 }).notNull(),
  category: varchar('category', { length: 80 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  providerId: integer('provider_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  providerId: integer('provider_id').references(() => users.id, { onDelete: 'set null' }),
  serviceId: integer('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  date: varchar('date', { length: 10 }).notNull(),
  timeSlot: varchar('time_slot', { length: 20 }).notNull(),
  status: bookingStatusEnum('status').notNull().default('PENDING'),
  paymentType: paymentTypeEnum('payment_type').notNull().default('CASH'),
  address: varchar('address', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  bookingId: integer('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  customerId: integer('customer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookingsAsCustomer: many(bookings, { relationName: 'customerBookings' }),
  bookingsAsProvider: many(bookings, { relationName: 'providerBookings' }),
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  provider: one(users, { fields: [services.providerId], references: [users.id] }),
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, { fields: [bookings.customerId], references: [users.id], relationName: 'customerBookings' }),
  provider: one(users, { fields: [bookings.providerId], references: [users.id], relationName: 'providerBookings' }),
  service: one(services, { fields: [bookings.serviceId], references: [services.id] }),
  review: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, { fields: [reviews.bookingId], references: [bookings.id] }),
  customer: one(users, { fields: [reviews.customerId], references: [users.id] }),
}));
