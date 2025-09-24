// This file is for server-side use only
// For client-side, we'll use API calls instead of direct Prisma access

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  // In browser, we don't use Prisma directly
  console.warn('Prisma client should not be used in browser environment. Use API calls instead.');
}

// For server-side usage (if needed in the future)
let prisma: any = null;

if (!isBrowser) {
  // Only import and use Prisma on server-side
  try {
    const { PrismaClient } = require('@prisma/client');
    
    const globalForPrisma = globalThis as unknown as {
      prisma: any;
    };

    prisma = globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prisma;
    }

    // Graceful shutdown
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
    });
  } catch (error) {
    console.warn('Prisma client not available:', error);
  }
}

export { prisma };
export default prisma;
