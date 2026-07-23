"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO = "/media/glp-1-slimming-hero.mp4";
const POSTER = "/images/optimized/glp-1/glp-1-hero-poster.webp";
const FINAL_FRAME = "/images/optimized/glp-1/glp-1-hero-final.webp";

type PlaybackState = "poster" | "playing" | "complete" | "fallback";

export function Glp1HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completeRef = useRef(false);
  const [allowMotion, setAllowMotion] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("poster");

  const completePlayback = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    videoRef.current?.pause();
    setPlaybackState("complete");
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const enabled = !query.matches;
      setAllowMotion(enabled);
      if (!enabled) {
        videoRef.current?.pause();
        setPlaybackState("poster");
      }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !allowMotion || completeRef.current) return;
    video.load();
    void video.play().catch(() => setPlaybackState("fallback"));
  }, [allowMotion]);

  const image = playbackState === "complete" ? FINAL_FRAME : POSTER;

  return (
    <div className="glp1-hero-media" data-playback-state={playbackState} aria-hidden="true">
      {/* A direct image swap keeps the final frame exact and prevents a transformed URL flash. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" fetchPriority="high" />
      <video
        ref={videoRef}
        className={playbackState === "playing" ? "is-visible" : ""}
        autoPlay
        muted
        playsInline
        preload="metadata"
        poster={POSTER}
        disablePictureInPicture
        tabIndex={-1}
        onPlaying={() => setPlaybackState("playing")}
        onEnded={completePlayback}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          if (Number.isFinite(video.duration) && video.currentTime >= video.duration - 0.08) {
            completePlayback();
          }
        }}
        onError={() => setPlaybackState("fallback")}
      >
        {allowMotion && <source src={VIDEO} type="video/mp4" />}
      </video>
    </div>
  );
}
