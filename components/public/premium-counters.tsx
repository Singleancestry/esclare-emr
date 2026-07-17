"use client";

import { useEffect, useRef, useState } from "react";

const metrics = [
  { value: 2, suffix: "", label: "Bicol locations" },
  { value: 4, suffix: "", label: "Diode wavelengths" },
  { value: 0, suffix: "", label: "Booking deposit" },
];

export function PremiumCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStarted(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(reducedMotionFrame);
    }
    const start = performance.now();
    let animationFrame = 0;
    const frame = (time: number) => {
      const next = Math.min((time - start) / 800, 1);
      setProgress(1 - Math.pow(1 - next, 3));
      if (next < 1) animationFrame = requestAnimationFrame(frame);
    };
    animationFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrame);
  }, [started]);
  return (
    <div ref={ref} className="grid grid-cols-3 divide-x divide-[#D8C9B4]">
      {metrics.map((metric) => (
        <div key={metric.label} className="px-2 text-center sm:px-6">
          <p className="font-serif text-3xl text-[#5B1830] sm:text-5xl">
            {Math.round(metric.value * progress)}
            {metric.suffix}
          </p>
          <p className="mt-2 text-[10px] font-bold uppercase text-[#75696C] sm:text-xs">
            {metric.label}
          </p>
        </div>
      ))}
    </div>
  );
}
