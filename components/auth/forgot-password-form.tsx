"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useActionState } from "react";
import {
  requestPasswordRecoveryAction,
  type PasswordRecoveryState,
} from "@/app/(auth)/forgot-password/actions";
import { Button } from "@/components/ui/button";

const initialState: PasswordRecoveryState = { error: null, success: null };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordRecoveryAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="w-full max-w-md rounded border border-[#D9DDE3] bg-white p-8 shadow-sm"
    >
      <h1 className="text-3xl font-semibold text-[#481827]">Reset staff password</h1>
      <p className="mt-2 text-sm leading-6 text-[#5F6368]">
        Enter the email address assigned to your employee account.
      </p>

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

      {state.error ? (
        <p className="mt-4 rounded border border-[#C43D4B] bg-[#FFF7F8] px-3 py-2 text-sm text-[#9B2130]">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="mt-4 rounded border border-[#7A9B76] bg-[#F4FAF3] px-3 py-2 text-sm text-[#315A2D]">
          {state.success}
        </p>
      ) : null}

      <Button className="mt-6 w-full" type="submit" disabled={isPending}>
        <Mail size={18} aria-hidden /> {isPending ? "Sending..." : "Send reset link"}
      </Button>
      <Link
        className="mt-5 block text-center text-sm font-semibold text-[#6F263D] underline-offset-4 hover:underline"
        href="/login"
      >
        Return to staff login
      </Link>
    </form>
  );
}
