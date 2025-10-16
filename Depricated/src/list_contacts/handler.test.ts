// src/list_contacts/handler.test.ts
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { __impl as listContactsImpl } from './handler.js';

type Ctx = { auth?: { user?: { base_url?: string; access_token?: string; environment?: 'sandbox' } } };

describe('list_contacts (direct impl)', () => {
  const originalFetch = global.fetch as any;

  beforeEach(() => {
    global.fetch = jest.fn(async (_url: string, _init?: any) => ({
      ok: true,
      status: 200,
      headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? 'application/json' : null) },
      json: async () => ({ value: [{ id: 'c1', name: 'Ada' }] }),
      text: async () => JSON.stringify({ value: [{ id: 'c1', name: 'Ada' }] }),
    })) as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  it('calls /api/Contacts with Bearer token and respects OData params', async () => {
    const ctx: Ctx = { auth: { user: { base_url: 'https://example.test', access_token: 'abc123', environment: 'sandbox' } } };
    const out = await listContactsImpl(ctx as any, { $top: 2, $select: 'id,name' });

    const call = (global.fetch as jest.Mock).mock.calls[0];
    const [url, init] = call as [string, { method: string; headers: Record<string,string> }];

    expect(url).toContain('/api/Contacts');
    const u = new URL(url);
    expect(u.searchParams.get('$top')).toBe('2');
    expect(u.searchParams.get('$select')).toBe('id,name');
    expect(init.method).toBe('GET');
    expect(init.headers.Authorization).toMatch(/^Bearer\s+abc123$/);

    expect(out).toBeTruthy();
  });
});
