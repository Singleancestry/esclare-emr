import Link from "next/link";
import { LockKeyhole } from "lucide-react";

export default function LockPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F6F8] px-6">
      <section className="w-full max-w-md rounded border border-[#D9DDE3] bg-white p-8 text-center shadow-sm">
        <LockKeyhole className="mx-auto text-[#6F263D]" size={36} aria-hidden />
        <h1 className="mt-4 text-3xl font-semibold text-[#481827]">Workspace locked</h1>
        <p className="mt-3 text-sm leading-6 text-[#5F6368]">
          Re-authenticate before returning to sensitive clinic workflows.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded bg-[#6F263D] px-5 py-3 text-sm font-semibold text-white focus-ring"
        >
          Unlock
        </Link>
      </section>
    </main>
  );
}
