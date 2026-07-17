"use client";

import { useEffect, useRef, useState } from "react";

const particles = [
  ["13%", "18%", "0s"],
  ["28%", "72%", "0.7s"],
  ["45%", "34%", "1.4s"],
  ["61%", "82%", "2.1s"],
  ["73%", "24%", "2.8s"],
  ["84%", "62%", "3.5s"],
] as const;

export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setIsVisible(true);
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const showFinalFrame = () => {
        video.pause();
        if (Number.isFinite(video.duration) && video.duration > 0) {
          video.currentTime = Math.max(0, video.duration - 0.08);
        }
      };

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        showFinalFrame();
      } else {
        video.addEventListener("loadedmetadata", showFinalFrame, { once: true });
      }

      return () => video.removeEventListener("loadedmetadata", showFinalFrame);
    }

    void video.play().catch(() => {
      // The maroon fallback remains visible when browser autoplay policy blocks playback.
    });
  }, []);

  return (
    <div className="hero-media" aria-hidden="true">
      <div className="hero-media-poster cinematic-hero-image" />
      <video
        ref={videoRef}
        className={`hero-media-video${isVisible ? " is-visible" : ""}`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setIsVisible(true)}
        onLoadedData={() => setIsVisible(true)}
        onSeeked={() => setIsVisible(true)}
        onEnded={() => setIsComplete(true)}
      >
        <source src="/media/flying-particles.mp4" type="video/mp4" />
      </video>
      <div className="hero-media-wash" />
      {isComplete ? (
        <div className="hero-particles">
          {particles.map(([left, top, delay]) => (
            <span key={`${left}-${top}`} style={{ left, top, animationDelay: delay }} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
