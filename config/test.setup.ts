// Global test setup
import { jest } from '@jest/globals';

// Increase timeout for database operations
jest.setTimeout(30000);

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USERNAME = 'postgres';
process.env.DB_PASSWORD = 'password';
process.env.DB_DATABASE = 'prellusion_test';