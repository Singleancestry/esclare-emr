"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";
import { passwordUpdateSchema } from "@/lib/validation/auth";

export type PasswordUpdateState = { error: string | null };

export async function updatePasswordAction(
  _previousState: PasswordUpdateState,
  formData: FormData,
): Promise<PasswordUpdateState> {
  const parsed = passwordUpdateSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the new password." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "Password update is temporarily unavailable." };

  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: "This reset link is invalid or has expired." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "Unable to update the password. Request a new reset link." };

  await supabase.auth.signOut();
  redirect("/login?password=updated");
}
