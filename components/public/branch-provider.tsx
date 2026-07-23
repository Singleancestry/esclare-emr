"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clinicBranches, getBranch, type BranchCode } from "@/lib/clinic/details";
import { trackPublicEvent } from "@/lib/analytics/public-events";

const STORAGE_KEY = "esclare:selected-branch";

type BranchContextValue = {
  branchCode: BranchCode;
  branch: ReturnType<typeof getBranch>;
  selectBranch: (code: BranchCode) => void;
};

const BranchContext = createContext<BranchContextValue | null>(null);

export function BranchProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [branchCode, setBranchCode] = useState<BranchCode>("naga");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (clinicBranches.some((branch) => branch.code === stored)) {
      const task = window.setTimeout(() => setBranchCode(stored as BranchCode), 0);
      return () => window.clearTimeout(task);
    }
  }, []);

  const value = useMemo<BranchContextValue>(
    () => ({
      branchCode,
      branch: getBranch(branchCode),
      selectBranch: (code) => {
        setBranchCode(code);
        window.localStorage.setItem(STORAGE_KEY, code);
        trackPublicEvent("branch_selected", { branch: code, route: window.location.pathname });
      },
    }),
    [branchCode],
  );

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useSelectedBranch() {
  const context = useContext(BranchContext);
  if (!context) throw new Error("useSelectedBranch must be used inside BranchProvider");
  return context;
}
