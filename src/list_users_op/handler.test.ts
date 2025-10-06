import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { __impl as listUsersImpl } from './handler.js';

type Ctx = { auth?: { user?: { base_url?: string; access_token?: string; environment?: 'sandbox' } } };

describe('list_users (direct impl)', () => {
  const originalFetch = global.fetch as any;

  beforeEach(() => {
    global.fetch = jest.fn(async (_url: string, _init?: any) => ({
      ok: true,
      status: 200,
      headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? 'application/json' : null) },
      json: async () => ({ value: [{ id: 1, name: 'Test' }] }),
      text: async () => JSON.stringify({ value: [{ id: 1, name: 'Test' }] }),
    })) as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('calls /api/Users with Bearer token and returns JSON', async () => {
    const ctx: Ctx = { auth: { user: { base_url: 'https://example.test', access_token: 'abc123', environment: 'sandbox' } } };
    const out = await listUsersImpl(ctx as any, { $top: 1 });

    const call = (global.fetch as jest.Mock).mock.calls[0];
    // Cast the tuple so TS knows what `init` is
    const [url, init] = call as [string, { method: string; headers: Record<string, string> }];

    expect(url).toContain('/api/Users');
    expect(init.method).toBe('GET');
    expect(init.headers.Authorization).toMatch(/^Bearer\s+abc123$/);

    expect(out).toBeTruthy();
  });
});
