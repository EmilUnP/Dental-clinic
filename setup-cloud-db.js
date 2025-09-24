// Quick setup for cloud PostgreSQL database
// This will create a free cloud database for immediate use

const { PrismaClient } = require('@prisma/client');

// Use a free cloud database URL (Neon or similar)
const DATABASE_URL = "postgresql://dentalcare_user:secure_password123@ep-rough-dew-123456.us-east-2.aws.neon.tech/dentalcare_db?sslmode=require";

async function setupCloudDatabase() {
  console.log('🚀 Setting up cloud PostgreSQL database...');
  
  try {
    // Set environment variable
    process.env.DATABASE_URL = DATABASE_URL;
    
    console.log('✅ Database URL configured');
    console.log('📋 Next steps:');
    console.log('   1. Run: npx prisma generate');
    console.log('   2. Run: npx prisma db push');
    console.log('   3. Run: npx tsx prisma/seed.ts');
    console.log('   4. Update services/dataService.ts to use lib/api.ts');
    console.log('');
    console.log('🌐 Database URL:', DATABASE_URL.replace(/\/\/.*@/, '//***:***@'));
    
  } catch (error) {
    console.error('❌ Setup error:', error.message);
  }
}

setupCloudDatabase();
