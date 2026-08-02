import "server-only";

type TurnstileVerification = {
  success?: boolean;
  hostname?: string;
};

function allowedHostnames() {
  return new Set(
    (process.env.TURNSTILE_ALLOWED_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function verifyTurnstile(formData: FormData, remoteIp?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production";

  const token = String(formData.get("cf-turnstile-response") ?? "").trim();
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    if (!response.ok) return false;

    const result = (await response.json()) as TurnstileVerification;
    if (!result.success) return false;

    const hostnames = allowedHostnames();
    return hostnames.size === 0 || Boolean(result.hostname && hostnames.has(result.hostname.toLowerCase()));
  } catch {
    return false;
  }
}
