// Set environment variables for tests before any modules are loaded
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
