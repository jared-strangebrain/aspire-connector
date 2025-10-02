import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { __impl as tokenImpl } from './handler.js';

type Ctx = { auth?: { user?: any } };

describe('token_request (direct impl)', () => {
  let originalFetch: typeof fetch | undefined;

  beforeEach(() => {
    originalFetch = globalThis.fetch;

    globalThis.fetch = (jest.fn(async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' } as any,
      json: async () => ({ AccessToken: 'newAT', RefreshToken: 'newRT', ExpiresIn: 3600 }),
      text: async () => '',
    })) as unknown) as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch as typeof fetch;
    jest.resetAllMocks();
  });

  it('mints a token', async () => {
    const ctx: Ctx = { auth: { user: {} } };

    const out = await tokenImpl(ctx as any, {
      client_id: 'id',
      client_secret: 'sec',
      environment: 'sandbox',
    });

    // Unwrap OperationHandlerResult in a way that satisfies TS and matches runtime
    const val = ((out as any).value ?? out) as {
      access_token: string;
      refresh_token?: string;
      environment: 'production' | 'sandbox';
      base_url: string;
      expires_at?: string;
    };

    expect(val.access_token).toBe('newAT');
    expect(val.environment).toBe('sandbox');
    expect(val.base_url).toContain('cloudsandbox');
  });
});
