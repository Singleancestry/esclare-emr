"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSelectedBranch } from "@/components/public/branch-provider";
import { trackPublicEvent } from "@/lib/analytics/public-events";

function MessengerMark() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className="size-7 fill-current">
      <path d="M18 3C9.6 3 3 9.2 3 17.4c0 4.7 2.2 8.8 5.8 11.4V34l5-2.8c1.4.4 2.8.6 4.2.6 8.4 0 15-6.2 15-14.4S26.4 3 18 3Zm1.5 19.4-3.8-4.1-7.4 4.1 8.1-8.6 3.9 4.1 7.3-4.1-8.1 8.6Z" />
    </svg>
  );
}

export function FloatingMessenger() {
  const pathname = usePathname();
  const { branch } = useSelectedBranch();

  useEffect(() => {
    trackPublicEvent("messenger_button_viewed", { branch: branch.code, route: pathname });
  }, [branch.code, pathname]);

  return (
    <aside className="messenger-dock" aria-label="ESCLARE Messenger contact">
      <a
        href={branch.messenger}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${branch.name} on Messenger`}
        className="messenger-button"
        onClick={() => {
          trackPublicEvent("messenger_button_clicked", {
            branch: branch.code,
            route: pathname,
            service: pathname === "/glp-1-slimming" ? "GLP-1 Slimming" : "general",
          });
        }}
      >
        <MessengerMark />
      </a>
    </aside>
  );
}
