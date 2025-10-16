import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { __impl as listOpportunitiesImpl } from './handler.js';

type Ctx = { auth?: { user?: { base_url?: string; access_token?: string; environment?: 'sandbox' } } };

describe('list_opportunities (direct impl)', () => {
  let originalFetch: typeof fetch | undefined;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    globalThis.fetch = (jest.fn(async () => ({
      ok: true,
      status: 200,
      headers: { get: (k: string) => (k.toLowerCase() === 'content-type' ? 'application/json' : null) } as any,
      json: async () => ({ value: [{ id: 'o1', name: 'Deal' }] }),
      text: async () => JSON.stringify({ value: [{ id: 'o1', name: 'Deal' }] }),
    })) as unknown) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch as typeof fetch;
    jest.resetAllMocks();
  });

  it('calls /api/Opportunities with Bearer token and OData params', async () => {
    const ctx: Ctx = { auth: { user: { base_url: 'https://example.test', access_token: 'abc123', environment: 'sandbox' } } };
    const out = await listOpportunitiesImpl(ctx as any, { $top: 5, $select: 'id,name' } as any);

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, any];
    expect(url).toContain('/api/Opportunities');
    const u = new URL(url);
    expect(u.searchParams.get('$top')).toBe('5');
    expect(u.searchParams.get('$select')).toBe('id,name');
    expect(init.method).toBe('GET');
    expect(init.headers.Authorization).toMatch(/^Bearer\s+abc123$/);

    expect(out).toBeTruthy();
  });
});
