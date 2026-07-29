"use client";

import { Printer } from "lucide-react";

export function PrintTermsButton() {
  return (
    <button type="button" onClick={() => window.print()} className="luxury-button print:hidden">
      <Printer size={17} aria-hidden="true" /> Print or save as PDF
    </button>
  );
}
