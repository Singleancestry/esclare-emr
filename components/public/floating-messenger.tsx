"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelectedBranch } from "@/components/public/branch-provider";
import { isBranchOpen } from "@/lib/clinic/details";
import { trackPublicEvent } from "@/lib/analytics/public-events";

const BADGE_KEY = "esclare:messenger-badge-dismissed";
const TOOLTIP_KEY = "esclare:messenger-tooltip-shown";

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
  const [showBadge, setShowBadge] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const open = isBranchOpen(branch);

  useEffect(() => {
    const badgeDismissed = window.localStorage.getItem(BADGE_KEY) === "true";
    const badgeTask = window.setTimeout(() => setShowBadge(!badgeDismissed), 0);
    trackPublicEvent("messenger_button_viewed", { branch: branch.code, route: pathname });
    if (!badgeDismissed) {
      trackPublicEvent("messenger_badge_shown", { branch: branch.code, route: pathname });
    }

    if (window.sessionStorage.getItem(TOOLTIP_KEY) === "true") {
      return () => window.clearTimeout(badgeTask);
    }
    const timeout = window.setTimeout(() => {
      setShowTooltip(true);
      window.sessionStorage.setItem(TOOLTIP_KEY, "true");
      trackPublicEvent("messenger_tooltip_shown", { branch: branch.code, route: pathname });
    }, 8000);
    return () => {
      window.clearTimeout(badgeTask);
      window.clearTimeout(timeout);
    };
  }, [branch.code, pathname]);

  const dismissBadge = () => {
    setShowBadge(false);
    window.localStorage.setItem(BADGE_KEY, "true");
  };

  return (
    <aside className="messenger-dock" aria-label="ESCLARE Messenger contact">
      {showTooltip && (
        <div className="messenger-tooltip" role="status">
          <button
            type="button"
            aria-label="Dismiss chat message"
            onClick={() => setShowTooltip(false)}
          >
            <X size={14} />
          </button>
          <strong>Need help? Chat with ESCLARE.</strong>
          <span>
            {open
              ? "Usually replies within minutes."
              : "Leave us a message and we'll reply during clinic hours."}
          </span>
        </div>
      )}
      {showBadge && <span className="messenger-badge">Chat with us</span>}
      <a
        href={branch.messenger}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${branch.name} on Messenger`}
        className="messenger-button"
        onClick={() => {
          dismissBadge();
          setShowTooltip(false);
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
