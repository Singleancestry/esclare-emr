"use client";

import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useActionState, useState } from "react";
import {
  updatePasswordAction,
  type PasswordUpdateState,
} from "@/app/(auth)/update-password/actions";
import { Button } from "@/components/ui/button";

const initialState: PasswordUpdateState = { error: null };

export function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePasswordAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <form
      action={formAction}
      className="w-full max-w-md rounded border border-[#D9DDE3] bg-white p-8 shadow-sm"
    >
      <h1 className="text-3xl font-semibold text-[#481827]">Choose a new password</h1>
      <p className="mt-2 text-sm leading-6 text-[#5F6368]">
        Use at least 12 characters with uppercase, lowercase and a number.
      </p>

      <label className="mt-6 block text-sm font-semibold text-[#262626]" htmlFor="password">
        New password
      </label>
      <div className="mt-2 flex rounded border border-[#D9DDE3] bg-white focus-within:outline focus-within:outline-2 focus-within:outline-[#C6A467]">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          className="w-full rounded px-3 py-3 outline-none"
          required
        />
        <button
          type="button"
          className="px-3 text-[#6F263D]"
          aria-label={showPassword ? "Hide new password" : "Show new password"}
          aria-pressed={showPassword}
          onClick={() => setShowPassword((visible) => !visible)}
        >
          {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      </div>

      <label className="mt-4 block text-sm font-semibold text-[#262626]" htmlFor="confirmPassword">
        Confirm new password
      </label>
      <div className="mt-2 flex rounded border border-[#D9DDE3] bg-white focus-within:outline focus-within:outline-2 focus-within:outline-[#C6A467]">
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmation ? "text" : "password"}
          autoComplete="new-password"
          className="w-full rounded px-3 py-3 outline-none"
          required
        />
        <button
          type="button"
          className="px-3 text-[#6F263D]"
          aria-label={showConfirmation ? "Hide confirmed password" : "Show confirmed password"}
          aria-pressed={showConfirmation}
          onClick={() => setShowConfirmation((visible) => !visible)}
        >
          {showConfirmation ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
        </button>
      </div>

      {state.error ? (
        <p className="mt-4 rounded border border-[#C43D4B] bg-[#FFF7F8] px-3 py-2 text-sm text-[#9B2130]">
          {state.error}
        </p>
      ) : null}

      <Button className="mt-6 w-full" type="submit" disabled={isPending}>
        <KeyRound size={18} aria-hidden /> {isPending ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}
