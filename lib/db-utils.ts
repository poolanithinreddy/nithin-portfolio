// Utility to check if we're in a safe environment for database operations
export const isDatabaseAvailable = () => {
  // During build time or in CI environments without DATABASE_URL, skip DB operations
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
    return false;
  }
  
  // Check if we're in a Vercel build environment without runtime database access
  if (process.env.VERCEL_ENV === 'preview' && process.env.NODE_ENV === 'production') {
    return false;
  }
  
  return true;
};

export const safeDbQuery = async <T>(queryFn: () => Promise<T>, fallback: T): Promise<T> => {
  if (!isDatabaseAvailable()) {
    console.log('Database not available, using fallback value');
    return fallback;
  }
  
  try {
    return await queryFn();
  } catch (error) {
    console.warn('Database query failed, using fallback:', error);
    return fallback;
  }
};