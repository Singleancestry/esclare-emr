import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FBF8F2] px-6 text-center">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7740]">
          404 · Page not found
        </p>
        <h1 className="mt-5 font-serif text-5xl text-[#481827]">This page is not available.</h1>
        <p className="mx-auto mt-5 max-w-lg leading-7 text-[#62595C]">
          The address may have changed, or the page may no longer exist. Return to the ESCLARE
          website to continue.
        </p>
        <Link href="/home" className="luxury-button mt-8">
          <ArrowLeft size={16} /> Return home
        </Link>
      </div>
    </main>
  );
}
