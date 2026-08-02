"use server";

import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { passwordRecoverySchema } from "@/lib/validation/auth";

export type PasswordRecoveryState = {
  error: string | null;
  success: string | null;
};

export async function requestPasswordRecoveryAction(
  _previousState: PasswordRecoveryState,
  formData: FormData,
): Promise<PasswordRecoveryState> {
  const parsed = passwordRecoverySchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Enter a valid email address.",
      success: null,
    };
  }

  if (!(await verifyTurnstile(formData))) {
    return {
      error: "Security verification failed. Refresh the page and try again.",
      success: null,
    };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return { error: "Password recovery is temporarily unavailable.", success: null };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://esclareph.com";
  const captchaToken = String(formData.get("cf-turnstile-response") ?? "").trim();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl.replace(/\/$/, "")}/auth/callback?next=/update-password`,
    captchaToken: captchaToken || undefined,
  });

  return {
    error: null,
    success: "If that staff account exists, a password-reset link has been sent.",
  };
}
