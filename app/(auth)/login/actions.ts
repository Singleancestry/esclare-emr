"use server";

import { redirect } from "next/navigation";
import type { Route } from "next";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { loginSchema } from "@/lib/validation/auth";

type LoginState = {
  error: string | null;
};

export async function signInAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your login details." };
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase is not configured for this environment." };
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Invalid email or password." };
  }

  const { data: appUser, error: appUserError } = await supabase
    .from("app_users")
    .select("status, mfa_required")
    .eq("auth_user_id", signInData.user.id)
    .maybeSingle();

  if (appUserError || !appUser) {
    await supabase.auth.signOut();
    return { error: "This account is not assigned to an active staff profile." };
  }

  if (appUser.status !== "active") {
    await supabase.auth.signOut();
    return { error: "This employee account is not active." };
  }

  if (appUser.mfa_required) {
    const { data: assurance, error: assuranceError } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assuranceError) {
      await supabase.auth.signOut();
      return { error: "Unable to verify multi-factor authentication status." };
    }
    if (assurance.currentLevel !== "aal2") redirect("/mfa" as Route);
  }

  redirect("/services");
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}
