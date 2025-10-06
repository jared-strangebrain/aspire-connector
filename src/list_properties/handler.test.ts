import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { __impl as listPropertiesImpl } from './handler.js';

type Ctx = { auth?: { user?: { base_url?: string; access_token?: string; environment?: 'sandbox' } } };

describe('list_properties (direct impl)', () => {
  let originalFetch: typeof fetch | undefined;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (jest.fn(async () => ({
      ok: true,
      status: 200,
      headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? 'application/json' : null) } as any,
      json: async () => ({ value: [{ id: 'p1', name: 'HQ' }] }),
      text: async () => JSON.stringify({ value: [{ id: 'p1', name: 'HQ' }] }),
    })) as unknown) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch as typeof fetch;
    jest.resetAllMocks();
  });

  it('calls /api/Properties with Bearer token and OData params', async () => {
    const ctx: Ctx = { auth: { user: { base_url: 'https://example.test', access_token: 'abc123', environment: 'sandbox' } } };
    const out = await listPropertiesImpl(ctx as any, { $top: 1, $select: 'id,name' } as any);

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, any];
    expect(url).toContain('/api/Properties');
    const u = new URL(url);
    expect(u.searchParams.get('$top')).toBe('1');
    expect(u.searchParams.get('$select')).toBe('id,name');
    expect(init.method).toBe('GET');
    expect(init.headers.Authorization).toMatch(/^Bearer\s+abc123$/);

    expect(out).toBeTruthy();
  });
});
