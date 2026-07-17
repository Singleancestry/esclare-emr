"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utilities/cn";

type SpotlightCardProps = { children: ReactNode; className?: string; as?: "div" | "article" };
type SpotlightStyle = CSSProperties & { "--spot-x": string; "--spot-y": string };

export function SpotlightCard({ children, className, as: Element = "div" }: SpotlightCardProps) {
  function trackPointer(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`);
  }

  const style: SpotlightStyle = { "--spot-x": "50%", "--spot-y": "50%" };
  return (
    <Element
      data-spotlight-card
      onPointerMove={trackPointer}
      style={style}
      className={cn("spotlight-card", className)}
    >
      {children}
    </Element>
  );
}
