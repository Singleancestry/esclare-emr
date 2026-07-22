import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ password?: string }>;
}) {
  const { password } = await searchParams;

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#F4F6F8] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex flex-col justify-between bg-[#481827] px-8 py-8 text-white lg:px-14">
        <div className="font-serif text-2xl font-semibold">ESCLARE</div>
        <div className="max-w-lg py-16">
          <h1 className="text-4xl font-semibold leading-tight">Secure staff access</h1>
          <p className="mt-5 leading-7 text-white/80">
            Staff workspaces enforce employee status, branch access, role permissions and audit
            logging before sensitive clinic data is shown.
          </p>
        </div>
        <p className="text-sm text-white/70">Aesthetic & Wellness Clinic</p>
      </section>
      <section className="flex items-center justify-center px-6 py-10">
        <LoginForm
          message={
            password === "updated" ? "Password updated. Sign in with your new password." : undefined
          }
        />
      </section>
    </main>
  );
}
