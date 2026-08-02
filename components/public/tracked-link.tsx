"use client";

import type { Route } from "next";
import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  trackPublicEvent,
  type PublicAnalyticsEvent,
} from "@/lib/analytics/public-events";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  href: string;
  event: PublicAnalyticsEvent;
  parameters?: Record<string, string | boolean>;
  children: ReactNode;
};

export function TrackedLink({ href, event, parameters = {}, children, ...props }: Props) {
  return (
    <Link
      href={href as Route}
      onClick={() =>
        trackPublicEvent(event, { route: window.location.pathname, ...parameters })
      }
      {...props}
    >
      {children}
    </Link>
  );
}
