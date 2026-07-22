"use client";

import { useActionState } from "react";
import { Eye, LogIn } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { signInAction } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";

export function LoginForm({ message }: { message?: string }) {
  const [state, formAction, isPending] = useActionState(signInAction, { error: null });

  return (
    <form
      action={formAction}
      className="w-full max-w-md rounded border border-[#D9DDE3] bg-white p-8 shadow-sm"
    >
      <h2 className="text-3xl font-semibold text-[#481827]">Staff login</h2>
      <p className="mt-2 text-sm leading-6 text-[#5F6368]">
        Use your individual employee account. Privileged roles require MFA.
      </p>

      {message ? (
        <p className="mt-4 rounded border border-[#7A9B76] bg-[#F4FAF3] px-3 py-2 text-sm text-[#315A2D]">
          {message}
        </p>
      ) : null}

      <label className="mt-6 block text-sm font-semibold text-[#262626]" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        className="focus-ring mt-2 w-full rounded border border-[#D9DDE3] px-3 py-3"
        required
      />

      <label className="mt-4 block text-sm font-semibold text-[#262626]" htmlFor="password">
        Password
      </label>
      <div className="mt-2 flex rounded border border-[#D9DDE3] bg-white focus-within:outline focus-within:outline-2 focus-within:outline-[#C6A467]">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded px-3 py-3 outline-none"
          required
        />
        <button type="button" className="px-3 text-[#6F263D]" aria-label="Password visibility">
          <Eye size={18} aria-hidden />
        </button>
      </div>

      <div className="mt-3 text-right">
        <Link
          className="text-sm font-semibold text-[#6F263D] underline-offset-4 hover:underline"
          href={"/forgot-password" as Route}
        >
          Forgot password?
        </Link>
      </div>

      {state.error ? (
        <p className="mt-4 rounded border border-[#C43D4B] bg-[#FFF7F8] px-3 py-2 text-sm text-[#9B2130]">
          {state.error}
        </p>
      ) : null}

      <Button className="mt-6 w-full" type="submit" disabled={isPending}>
        <LogIn size={18} aria-hidden /> {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
