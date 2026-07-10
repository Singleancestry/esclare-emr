import Link from "next/link";
import { MapPin } from "lucide-react";

const branches = ["ESCLARE Naga", "ESCLARE Daet"];

export default function BranchesPage() {
  return (
    <main className="min-h-screen bg-[#F8F4ED] px-6 py-10 text-[#262626]">
      <section className="mx-auto max-w-3xl">
        <Link href="/home" className="font-serif text-2xl font-semibold text-[#6F263D]">
          ESCLARE
        </Link>
        <h1 className="mt-8 text-4xl font-semibold text-[#481827]">Branches</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {branches.map((branch) => (
            <article key={branch} className="rounded border border-[#D9DDE3] bg-white p-5 shadow-sm">
              <MapPin className="text-[#6F263D]" size={22} aria-hidden />
              <h2 className="mt-3 text-xl font-semibold text-[#481827]">{branch}</h2>
              <p className="mt-2 text-sm leading-6 text-[#5F6368]">
                Fictional development branch seeded for Phase 1 multi-branch access controls.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
