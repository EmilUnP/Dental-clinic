// Database configuration
export const databaseConfig = {
  url: process.env.DATABASE_URL || "postgresql://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19OUnFRUTdNQkRmUWR5OVM5aXRDWTgiLCJhcGlfa2V5IjoiMDFLNVcwOENBVERDMkVUUEFCWVBYNVg2U00iLCJ0ZW5hbnRfaWQiOiI3NTc4MTk4OTZjYWExMzllNzk5OTE5YzcyMmIxOTI4NTJlODA5YmZmNmRhOTFiODI5NWQ0YzMyNGNiYzZiOGRhIiwiaW50ZXJuYWxfc2VjcmV0IjoiMTM0ZmZmOTEtMzdlNS00MWVjLTg4MmMtNWJlNmIyMDE4MGFkIn0.bvOVxQD6BQ7S8Apk05b8TYI2n4SFEio0itsq4dVjPCQ",
  options: {
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  }
};

// Application configuration
export const appConfig = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key-for-sensitive-data',
  maxFileSize: process.env.MAX_FILE_SIZE || '10MB',
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
};

// Email configuration
export const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
};
