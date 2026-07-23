"use client";

import { Check, ChevronDown, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { clinicBranches, type BranchCode } from "@/lib/clinic/details";
import { useSelectedBranch } from "@/components/public/branch-provider";

export function BranchSelector({ mobile = false }: { mobile?: boolean }) {
  const { branch, selectBranch } = useSelectedBranch();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  return (
    <div ref={rootRef} className={`branch-selector ${mobile ? "branch-selector-mobile" : ""}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
        className="branch-selector-trigger"
      >
        <MapPin size={15} aria-hidden="true" />
        <span>{branch.name.replace("ESCLARE ", "")}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <div className="branch-selector-menu" role="listbox" aria-label="Select clinic branch">
          {clinicBranches.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={item.code === branch.code}
              className="branch-selector-option"
              onClick={() => {
                selectBranch(item.code as BranchCode);
                setOpen(false);
              }}
            >
              <span>
                <strong>{item.name}</strong>
                <small>{item.schedule}</small>
              </span>
              {item.code === branch.code && <Check size={16} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
