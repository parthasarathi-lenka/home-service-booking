import 'dotenv/config';
import { db } from './index';
import { users, services } from './schema';
import bcrypt from 'bcryptjs';

async function seed() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const [customer] = await db.insert(users).values({
    name: 'Demo Customer', email: 'customer@test.com', passwordHash, role: 'CUSTOMER',
  }).returning();

  const [provider] = await db.insert(users).values({
    name: 'Demo Provider', email: 'provider@test.com', passwordHash, role: 'PROVIDER',
  }).returning();

  await db.insert(users).values({
    name: 'Demo Admin', email: 'admin@test.com', passwordHash, role: 'ADMIN',
  });

  await db.insert(services).values([
    { name: 'Home Deep Cleaning', category: 'Cleaning', description: 'Full house deep cleaning service.', price: '49.99', providerId: provider.id },
    { name: 'AC Repair & Service', category: 'Appliance Repair', description: 'AC gas refill and repair.', price: '39.00', providerId: provider.id },
    { name: 'Electrician Visit', category: 'Electrical', description: 'Wiring, switches, fixture installs.', price: '25.00', providerId: provider.id },
    { name: 'Plumbing Fix', category: 'Plumbing', description: 'Leak fixes and pipe installs.', price: '30.00', providerId: provider.id },
  ]);

  console.log('Seed complete:');
  console.log('customer@test.com / provider@test.com / admin@test.com  (password: password123)');
  console.log('customerId:', customer.id, 'providerId:', provider.id);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
