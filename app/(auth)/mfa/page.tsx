import { redirect } from "next/navigation";
import { MfaForm } from "@/components/auth/mfa-form";
import { createSupabaseServerClient } from "@/lib/auth/supabase-server";

export default async function MfaPage() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/login");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F6F8] px-6 py-10">
      <MfaForm email={user.email ?? "your staff account"} />
    </main>
  );
}
