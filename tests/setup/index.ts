import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

beforeAll(() => {
  vi.mock('@clerk/nextjs/server', () => ({
    currentUser: vi.fn(() => Promise.resolve(null)),
    auth: vi.fn(() => Promise.resolve({ userId: null })),
  }));

  vi.mock('@clerk/nextjs/client', () => ({
    useUser: vi.fn(() => ({ user: null, isLoaded: true, isSignedIn: false })),
    useClerk: vi.fn(() => ({ user: null, signOut: vi.fn() })),
  }));

  vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => ({
      from: vi.fn(() => ({
        select: vi.fn(() => Promise.resolve({ data: null, error: null })),
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
        update: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ data: null, error: null })) })),
        delete: vi.fn(() => ({ eq: vi.fn(() => Promise.resolve({ data: null, error: null })) })),
      })),
    })),
  }));
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  vi.clearAllMocks();
});
