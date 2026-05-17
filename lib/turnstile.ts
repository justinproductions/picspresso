const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface VerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // If Turnstile is not configured (no secret in env), fall through.
  // Once the secret is set on Vercel, validation becomes enforced.
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp && remoteIp !== "unknown") body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    if (!res.ok) return false;
    const data = (await res.json()) as VerifyResponse;
    return data.success === true;
  } catch {
    return false;
  }
}
