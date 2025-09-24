// Complete Database Migration Script
// This will attempt to set up and migrate to a real database

const { execSync } = require('child_process');

console.log('🚀 COMPLETE DATABASE MIGRATION');
console.log('================================');
console.log('');

// Try different database options
const databaseOptions = [
  {
    name: 'Local PostgreSQL (if installed)',
    url: 'postgresql://postgres:postgres@localhost:5432/dentalcare_db'
  },
  {
    name: 'Test Database',
    url: 'postgresql://postgres:postgres@localhost:5432/test_db'
  }
];

async function tryDatabaseMigration() {
  console.log('🔍 Attempting database migration...');
  console.log('');

  for (const option of databaseOptions) {
    console.log(`📋 Trying: ${option.name}`);
    console.log(`🔗 URL: ${option.url.replace(/\/\/.*@/, '//***:***@')}`);
    
    try {
      // Set environment variable
      process.env.DATABASE_URL = option.url;
      
      console.log('   ✅ Setting environment variable...');
      
      // Try to generate Prisma client
      console.log('   📦 Generating Prisma client...');
      execSync('npx prisma generate', { stdio: 'pipe' });
      console.log('   ✅ Prisma client generated');
      
      // Try to push schema
      console.log('   🗄️ Pushing schema to database...');
      execSync('npx prisma db push', { stdio: 'pipe' });
      console.log('   ✅ Schema pushed successfully');
      
      // Try to seed database
      console.log('   🌱 Seeding database...');
      execSync('npx tsx prisma/seed.ts', { stdio: 'pipe' });
      console.log('   ✅ Database seeded');
      
      console.log('');
      console.log('🎉 SUCCESS! Database migration completed!');
      console.log('');
      console.log('📋 Final step: Update your app to use real database');
      console.log('   Edit services/dataService.ts line 1:');
      console.log('   Change: import { DashboardAPI, DashboardStats } from \'../lib/api-mock\';');
      console.log('   To:     import { DashboardAPI, DashboardStats } from \'../lib/api\';');
      console.log('');
      console.log('🚀 Your dental care app now has a real database!');
      
      return true;
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message.split('\n')[0]}`);
      console.log('');
    }
  }
  
  console.log('❌ Could not connect to any database');
  console.log('');
  console.log('🔧 To complete migration manually:');
  console.log('   1. Set up PostgreSQL database (local or cloud)');
  console.log('   2. Set DATABASE_URL environment variable');
  console.log('   3. Run: npx prisma generate');
  console.log('   4. Run: npx prisma db push');
  console.log('   5. Run: npx tsx prisma/seed.ts');
  console.log('   6. Update services/dataService.ts to use lib/api.ts');
  console.log('');
  console.log('📖 See FINAL-DATABASE-SETUP.md for detailed instructions');
  
  return false;
}

tryDatabaseMigration();
