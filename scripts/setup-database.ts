#!/usr/bin/env tsx

import { execSync } from 'child_process';

// Load environment variables (optional)
try {
  const { config } = require('dotenv');
  config();
} catch (error) {
  console.log('Note: dotenv not available, using environment variables directly');
}

async function setupDatabase() {
  console.log('🚀 Starting database setup...');

  try {
    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Push schema to database
    console.log('🗄️ Pushing schema to database...');
    execSync('npx prisma db push', { stdio: 'inherit' });

    // Seed the database
    console.log('🌱 Seeding database...');
    execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });

    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log('🎉 Your dental care application is now ready with:');
    console.log('   📊 Real PostgreSQL database');
    console.log('   👥 Sample patients, doctors, and appointments');
    console.log('   🦷 Complete dental services catalog');
    console.log('   📅 Appointment scheduling system');
    console.log('   💳 Payment tracking');
    console.log('   📋 Medical records management');
    console.log('');
    console.log('🔧 Available commands:');
    console.log('   npm run db:studio    - Open Prisma Studio');
    console.log('   npm run db:reset     - Reset database');
    console.log('   npm run db:seed      - Re-seed database');
    console.log('   npm run dev          - Start development server');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
