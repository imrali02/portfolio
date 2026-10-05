/**
 * Contact-form verification worker.
 *
 * POST { token } -> verifies the GotCHA token server-side and, if it's valid,
 * returns { email }. The secret key and the email address only ever live here
 * (as Cloudflare secrets), never in the public site bundle.
 */

interface Env {
  /** GotCHA secret key (`wrangler secret put GOTCHA_SECRET`). */
  GOTCHA_SECRET: string;
  /** Address revealed to verified visitors (`wrangler secret put CONTACT_EMAIL`). */
  CONTACT_EMAIL: string;
  /** Comma-separated list of origins allowed to call this worker (wrangler.toml). */
  ALLOWED_ORIGINS: string;
}

interface SiteVerifyResult {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

const VERIFY_URL = 'https://api.gotcha.land/api/siteverify';
const MAX_TOKEN_LENGTH = 4096;

export default {
  async fetch(request, env): Promise<Response> {
    const allowedOrigins = env.ALLOWED_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    const origin = request.headers.get('Origin') ?? '';

    if (!allowedOrigins.includes(origin)) {
      return json({ error: 'forbidden_origin' }, 403);
    }

    const cors = { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...cors,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405, cors);
    }

    if (!env.GOTCHA_SECRET || !env.CONTACT_EMAIL) {
      console.error('GOTCHA_SECRET and/or CONTACT_EMAIL secrets are not set');
      return json({ error: 'not_configured' }, 500, cors);
    }

    let token: unknown;
    try {
      ({ token } = await request.json<{ token?: unknown }>());
    } catch {
      return json({ error: 'bad_request' }, 400, cors);
    }
    if (typeof token !== 'string' || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
      return json({ error: 'bad_request' }, 400, cors);
    }

    const result = await verifyToken(token, env.GOTCHA_SECRET, request.headers.get('CF-Connecting-IP'));
    if (!result) {
      return json({ error: 'verify_unavailable' }, 502, cors);
    }
    if (!result.success) {
      return json({ error: 'captcha_failed', codes: result['error-codes'] ?? [] }, 403, cors);
    }

    // Reject tokens solved on some other site that happens to share the key.
    const allowedHosts = new Set(allowedOrigins.map((o) => new URL(o).hostname));
    if (result.hostname && !allowedHosts.has(result.hostname)) {
      return json({ error: 'captcha_failed', codes: ['hostname-mismatch'] }, 403, cors);
    }

    return json({ email: env.CONTACT_EMAIL }, 200, { ...cors, 'Cache-Control': 'no-store' });
  },
} satisfies ExportedHandler<Env>;

/** Returns the siteverify result, or null if GotCHA couldn't be reached / answered garbage. */
async function verifyToken(
  token: string,
  secret: string,
  remoteip: string | null,
): Promise<SiteVerifyResult | null> {
  const body = new URLSearchParams({ secret, response: token });
  if (remoteip) body.set('remoteip', remoteip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const data = (await res.json().catch(() => null)) as SiteVerifyResult | null;
    if (data && typeof data.success === 'boolean') {
      return data;
    }
    console.error(`siteverify returned ${res.status} without a usable body`);
    return null;
  } catch (err) {
    console.error('siteverify request failed', err);
    return null;
  }
}

function json(data: unknown, status: number, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}
