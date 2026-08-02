"use client";

import { createBrowserClient } from "@supabase/ssr";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type MfaSetup = {
  factorId: string;
  qrCode: string | null;
  secret: string | null;
};

export function MfaForm({ email }: { email: string }) {
  const supabase = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return url && key ? createBrowserClient(url, key) : null;
  }, []);
  const [setup, setSetup] = useState<MfaSetup | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      if (!supabase) {
        setError("Multi-factor authentication is temporarily unavailable.");
        return;
      }

      const { data: assurance, error: assuranceError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (assuranceError) {
        setError("Unable to check multi-factor authentication status.");
        return;
      }
      if (assurance.currentLevel === "aal2") {
        window.location.replace("/dashboard");
        return;
      }

      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      if (factorsError) {
        setError("Unable to load your authentication factors.");
        return;
      }

      const verified = factors.totp[0];
      if (verified) {
        if (!cancelled) setSetup({ factorId: verified.id, qrCode: null, secret: null });
        return;
      }

      const unverifiedFactors = factors.all.filter(
        (factor) => factor.factor_type === "totp" && factor.status === "unverified",
      );
      for (const factor of unverifiedFactors) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      const { data: enrollment, error: enrollmentError } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "ESCLARE Staff",
      });
      if (enrollmentError) {
        setError("Unable to start authenticator setup. Refresh the page and try again.");
        return;
      }

      if (!cancelled) {
        setSetup({
          factorId: enrollment.id,
          qrCode: enrollment.totp.qr_code,
          secret: enrollment.totp.secret,
        });
      }
    }

    void initialize();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !setup || code.length !== 6) return;

    setError(null);
    setIsVerifying(true);
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: setup.factorId,
      code,
    });
    if (verifyError) {
      setError("The verification code is invalid or expired. Enter the current six-digit code.");
      setCode("");
      setIsVerifying(false);
      return;
    }

    window.location.assign("/dashboard");
  }

  return (
    <form
      onSubmit={verify}
      className="w-full max-w-md rounded border border-[#D9DDE3] bg-white p-8 shadow-sm"
    >
      <h1 className="text-3xl font-semibold text-[#481827]">Secure your staff account</h1>
      <p className="mt-2 text-sm leading-6 text-[#5F6368]">
        Multi-factor authentication is required for {email}.
      </p>

      {!setup && !error ? (
        <div className="mt-8 flex items-center gap-3 text-sm text-[#5F6368]">
          <LoaderCircle className="animate-spin" size={18} aria-hidden /> Preparing secure access...
        </div>
      ) : null}

      {setup?.qrCode ? (
        <div className="mt-6">
          <p className="text-sm leading-6 text-[#262626]">
            Scan this QR code with Google Authenticator, Microsoft Authenticator, or another TOTP
            authenticator app.
          </p>
          {/* Supabase returns a trusted, account-specific SVG data URL for TOTP enrollment. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={setup.qrCode}
            alt="QR code for ESCLARE staff authenticator setup"
            className="mx-auto mt-4 aspect-square w-56 border border-[#D9DDE3] bg-white p-2"
          />
          {setup.secret ? (
            <p className="mt-3 break-all text-xs leading-5 text-[#5F6368]">
              Manual setup key: <span className="font-mono text-[#262626]">{setup.secret}</span>
            </p>
          ) : null}
        </div>
      ) : setup ? (
        <p className="mt-6 text-sm leading-6 text-[#262626]">
          Open your authenticator app and enter the current code for ESCLARE Staff.
        </p>
      ) : null}

      {setup ? (
        <>
          <label className="mt-6 block text-sm font-semibold text-[#262626]" htmlFor="code">
            Six-digit verification code
          </label>
          <input
            id="code"
            name="code"
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            className="focus-ring mt-2 w-full rounded border border-[#D9DDE3] px-3 py-3 text-center font-mono text-2xl tracking-[0.3em]"
            required
          />
        </>
      ) : null}

      {error ? (
        <p className="mt-4 rounded border border-[#C43D4B] bg-[#FFF7F8] px-3 py-2 text-sm text-[#9B2130]">
          {error}
        </p>
      ) : null}

      <Button
        className="mt-6 w-full"
        type="submit"
        disabled={!setup || code.length !== 6 || isVerifying}
      >
        <KeyRound size={18} aria-hidden /> {isVerifying ? "Verifying..." : "Verify and continue"}
      </Button>
    </form>
  );
}
