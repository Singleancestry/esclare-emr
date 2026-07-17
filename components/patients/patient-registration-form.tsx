"use client";

import { useActionState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Save } from "lucide-react";
import {
  createPatientAction,
  type PatientRegistrationState,
} from "@/app/(staff)/patients/new/actions";
import type { BranchAccess } from "@/lib/permissions/types";
import type { PatientRegistrationInput } from "@/lib/validation/patient";
import { calculateAge, calculateBmi } from "@/lib/patients/utils";
import { Button } from "@/components/ui/button";

const initialState: PatientRegistrationState = {
  status: "idle",
  message: null,
};

type PatientRegistrationFormProps = {
  branches: BranchAccess[];
  verifierName: string;
};

export function PatientRegistrationForm({ branches, verifierName }: PatientRegistrationFormProps) {
  const [state, formAction, isPending] = useActionState(createPatientAction, initialState);
  const { control, register } = useForm<PatientRegistrationInput>({
    defaultValues: {
      nationality: "Filipino",
      preferredLanguage: "English",
      preferredContactMethod: "sms",
      country: "Philippines",
      identityVerificationMethod: "Government ID",
      verifiedBy: verifierName,
      branchId: branches[0]?.id,
    },
  });
  const dateOfBirth = useWatch({ control, name: "dateOfBirth" });
  const heightValue = useWatch({ control, name: "heightCm" });
  const weightValue = useWatch({ control, name: "weightKg" });
  const heightCm = Number(heightValue);
  const weightKg = Number(weightValue);
  const age = useMemo(() => (dateOfBirth ? calculateAge(dateOfBirth) : null), [dateOfBirth]);
  const bmi = useMemo(() => calculateBmi(heightCm, weightKg), [heightCm, weightKg]);

  return (
    <form action={formAction} className="grid gap-5">
      {state.message ? (
        <p
          className={`rounded border px-4 py-3 text-sm font-semibold ${
            state.status === "success"
              ? "border-[#28875B] bg-[#F2FBF7] text-[#1F6B48]"
              : "border-[#C43D4B] bg-[#FFF7F8] text-[#9B2130]"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <Step title="1. Identity">
        <Field label="First name" input={<input {...register("firstName")} required />} />
        <Field label="Middle name" input={<input {...register("middleName")} />} />
        <Field label="Last name" input={<input {...register("lastName")} required />} />
        <Field label="Preferred name" input={<input {...register("preferredName")} />} />
        <Field
          label="Date of birth"
          input={<input type="date" {...register("dateOfBirth")} required />}
        />
        <Readout
          label="Age"
          value={age === null ? "Calculated after date of birth" : `${age} years`}
        />
        <Field
          label="Sex at birth"
          input={
            <select {...register("sexAtBirth")} required>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="intersex">Intersex</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          }
        />
        <Field label="Gender" input={<input {...register("gender")} />} />
        <Field label="Civil status" input={<input {...register("civilStatus")} />} />
        <Field label="Nationality" input={<input {...register("nationality")} required />} />
      </Step>

      <Step title="2. Contact">
        <Field
          label="Mobile"
          input={<input {...register("mobile")} placeholder="09171234567" required />}
        />
        <Field
          label="Secondary mobile"
          input={<input {...register("secondaryMobile")} placeholder="09181234567" />}
        />
        <Field label="Email" input={<input type="email" {...register("email")} />} />
        <Field
          label="Preferred contact"
          input={
            <select {...register("preferredContactMethod")}>
              <option value="sms">SMS</option>
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="viber">Viber</option>
              <option value="messenger">Messenger</option>
            </select>
          }
        />
        <Field
          label="Preferred language"
          input={<input {...register("preferredLanguage")} required />}
        />
      </Step>

      <Step title="3. Address">
        <Field label="Country" input={<input {...register("country")} required />} />
        <Field label="Region" input={<input {...register("region")} required />} />
        <Field label="Province" input={<input {...register("province")} required />} />
        <Field
          label="City or municipality"
          input={<input {...register("cityMunicipality")} required />}
        />
        <Field label="Barangay" input={<input {...register("barangay")} required />} />
        <Field label="Street" input={<input {...register("street")} />} />
        <Field label="Building" input={<input {...register("building")} />} />
        <Field label="Postal code" input={<input {...register("postalCode")} />} />
      </Step>

      <Step title="4. Emergency Contact">
        <Field label="Name" input={<input {...register("emergencyName")} required />} />
        <Field
          label="Relationship"
          input={<input {...register("emergencyRelationship")} required />}
        />
        <Field label="Mobile" input={<input {...register("emergencyMobile")} required />} />
        <Field
          label="Secondary contact"
          input={<input {...register("emergencySecondaryContact")} />}
        />
      </Step>

      <Step title="5. Physical Information">
        <Field
          label="Height (cm)"
          input={<input type="number" step="0.1" {...register("heightCm")} />}
        />
        <Field
          label="Weight (kg)"
          input={<input type="number" step="0.1" {...register("weightKg")} />}
        />
        <Readout
          label="BMI"
          value={bmi === null ? "Calculated after height and weight" : bmi.toString()}
        />
      </Step>

      <Step title="6. Referral and Marketing">
        <Field label="Referral source" input={<input {...register("referralSource")} />} />
        <Field label="Referred by" input={<input {...register("referredBy")} />} />
        <Field label="Campaign" input={<input {...register("campaign")} />} />
        <Field label="Promo code" input={<input {...register("promoCode")} />} />
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" {...register("smsMarketingConsent")} />
          SMS marketing consent
        </label>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" {...register("emailMarketingConsent")} />
          Email marketing consent
        </label>
      </Step>

      <Step title="7. Privacy">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" {...register("privacyAcknowledged")} required />
          Privacy notice acknowledged
        </label>
        <Field
          label="Identity verification method"
          input={<input {...register("identityVerificationMethod")} required />}
        />
        <Field label="Verified by" input={<input {...register("verifiedBy")} required />} />
        <Field
          label="Branch"
          input={
            <select {...register("branchId")} required>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          }
        />
      </Step>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          <Save size={17} aria-hidden /> {isPending ? "Saving..." : "Create patient"}
        </Button>
      </div>
    </form>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded border border-[#D9DDE3] bg-white p-5 shadow-sm">
      <legend className="px-1 text-lg font-semibold text-[#481827]">{title}</legend>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  input,
}: {
  label: string;
  input: React.ReactElement<
    React.InputHTMLAttributes<HTMLInputElement> | React.SelectHTMLAttributes<HTMLSelectElement>
  >;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#262626]">
      {label}
      <span className="[&>input]:focus-ring [&>input]:min-h-10 [&>input]:rounded [&>input]:border [&>input]:border-[#D9DDE3] [&>input]:px-3 [&>select]:focus-ring [&>select]:min-h-10 [&>select]:rounded [&>select]:border [&>select]:border-[#D9DDE3] [&>select]:bg-white [&>select]:px-3">
        {input}
      </span>
    </label>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-[#D9DDE3] bg-[#F8F4ED] px-3 py-2">
      <p className="text-xs font-semibold uppercase text-[#6F263D]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#262626]">{value}</p>
    </div>
  );
}
