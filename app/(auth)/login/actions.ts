"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { evaluateStaffAccess } from "@/lib/auth/guards";
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

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Invalid email or password." };
  }

  const access = await evaluateStaffAccess();

  if (!access.allowed) {
    await supabase.auth.signOut();
    return { error: access.reason };
  }

  redirect("/dashboard");
}
